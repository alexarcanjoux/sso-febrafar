<script>
  /**
   * Índice das telas — o mapa de tudo que o SSO desenha.
   *
   * Não é tela de produto: é a bancada de quem trabalha aqui. Uma tela de
   * acesso quase nunca é alcançável por navegação (a de link expirado precisa
   * de uma URL sem token, a de convite inválido precisa de um convite que não
   * existe), então sem um índice conferir uma mudança vira montar URL na mão,
   * produto por produto, variante por variante.
   *
   * ⚠️ CARTÃO E LINK, SEM PRÉVIA. Já teve miniatura ao vivo aqui: cada cartão
   * era um `iframe` com a tela rodando. Bonito e caro — 44 cópias da aplicação
   * numa página só, que obrigaram um filtro de um produto por vez e, com ele,
   * esconderam três quartos do índice. Um índice existe para mostrar TUDO de
   * uma vez; a tela em tamanho real está a um clique.
   *
   * ⚠️ AS VARIANTES SÃO O PONTO, e não os caminhos. `/redefinir-senha` é uma
   * rota e duas telas — com token é o formulário, sem token é o aviso de link
   * expirado — e é justamente a segunda que ninguém lembra de olhar. Por isso o
   * índice é de VARIANTES, com a query que faz cada uma aparecer.
   *
   * ⚠️ OS LINKS SAEM DO `rota()`, o mesmo helper das telas de verdade. Escrever
   * `?produto=` à mão aqui faria o índice mentir no dia em que a regra do
   * parâmetro mudasse — hoje, por exemplo, a Febrafar é o default e não vai na
   * URL, e é isso que os links mostram.
   *
   * ⚠️ O QUE A JORNADA DESLIGA CONTINUA NA LISTA, marcado como guarda. Pulse
   * não usa convite e Febrafar não usa MFA: nesses casos a tela existe e mostra
   * a explicação, que também é um estado a conferir.
   */

  import { PRODUTOS } from '$lib/produtos.js';
  import { rota } from '$lib/rotas.js';

  const produtos = Object.values(PRODUTOS);

  /** Valores de exemplo — o backend não é chamado, só a tela é montada. */
  const EMAIL = 'voce@empresa.com.br';
  const TOKEN = 'exemplo-de-token';
  const CONVITE = 'exemplo-de-convite';

  /**
   * As variantes de cada tela, na ordem do fluxo.
   *
   * `guarda` diz o que a jornada do produto desliga; nesse caso a tela mostra a
   * explicação em vez do conteúdo.
   *
   * @param {import('$lib/produtos.js').Produto} produto
   */
  const variantes = (produto) => [
    { grupo: 'Entrar', nome: 'Login', caminho: '/login', extras: {} },
    {
      grupo: 'Entrar',
      nome: 'Verificação em duas etapas',
      caminho: '/verificacao',
      extras: { email: EMAIL },
      guarda: produto.jornada.mfa ? null : 'sem MFA',
    },
    {
      grupo: 'Primeiro acesso',
      nome: 'Convite válido',
      caminho: '/primeiro-acesso',
      extras: { convite: CONVITE },
      guarda: produto.jornada.primeiroAcesso ? null : 'sem convite',
    },
    {
      grupo: 'Primeiro acesso',
      nome: 'Convite não encontrado',
      caminho: '/primeiro-acesso',
      extras: {},
      guarda: produto.jornada.primeiroAcesso ? null : 'sem convite',
    },
    {
      grupo: 'Primeiro acesso',
      nome: 'Senha definida',
      caminho: '/senha-alterada',
      extras: { origem: 'primeiro-acesso' },
    },
    { grupo: 'Recuperar senha', nome: 'Pedir o link', caminho: '/esqueci-senha', extras: {} },
    {
      grupo: 'Recuperar senha',
      nome: 'Pedir o link (e-mail preenchido)',
      caminho: '/esqueci-senha',
      extras: { email: EMAIL },
    },
    {
      grupo: 'Recuperar senha',
      nome: 'E-mail enviado',
      caminho: '/email-enviado',
      extras: { email: EMAIL },
    },
    {
      grupo: 'Recuperar senha',
      nome: 'Nova senha',
      caminho: '/redefinir-senha',
      extras: { token: TOKEN },
    },
    { grupo: 'Recuperar senha', nome: 'Link expirado', caminho: '/redefinir-senha', extras: {} },
    { grupo: 'Recuperar senha', nome: 'Senha alterada', caminho: '/senha-alterada', extras: {} },
  ];
</script>

<svelte:head>
  <title>Índice das telas · SSO Febrafar</title>
</svelte:head>

<div class="min-h-screen bg-slate-50">
  <header class="border-b border-slate-200 bg-suporte-branco">
    <div class="mx-auto max-w-[1280px] px-20px py-24px md:px-32px">
      <h1 class="text-2xl font-semibold tracking-[-0.01em] text-slate-800">Índice das telas</h1>
      <p class="mt-4px max-w-[70ch] text-sm text-slate-500">
        Todas as telas do SSO, em todos os produtos, com as variantes que dependem da query.
        Os links são montados pelo mesmo <code class="rounded-4px bg-slate-100 px-4px py-2px text-xs">rota()</code>
        das telas de verdade — a Febrafar é o produto default, por isso os links dela não levam
        <code class="rounded-4px bg-slate-100 px-4px py-2px text-xs">?produto=</code>.
      </p>

      <!-- Atalhos para as seções: com quatro produtos a página passa de uma
           dobra, e rolar procurando o roxo é pior que um índice do índice. -->
      <nav class="mt-20px flex flex-wrap gap-8px">
        {#each produtos as p (p.id)}
          <a
            href="#{p.id}"
            data-produto={p.id}
            class="flex items-center gap-8px rounded-full border border-slate-200 bg-suporte-branco
                   px-12px py-6px text-sm font-medium text-slate-600 transition-control
                   hover:border-brand-500 hover:text-brand-700
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
                   focus-visible:ring-offset-2"
          >
            <span class="h-10px w-10px rounded-full bg-brand-500"></span>
            {p.nome}
          </a>
        {/each}
      </nav>
    </div>
  </header>

  <main class="mx-auto max-w-[1280px] px-20px py-32px md:px-32px">
    {#each produtos as produto (produto.id)}
      <!-- `data-produto` também aqui: cada seção usa a escala `brand` do seu
           produto, então a cor separa os blocos sem precisar de régua. -->
      <section
        id={produto.id}
        data-produto={produto.id}
        class="mb-32px scroll-mt-20px overflow-hidden rounded-16px border border-slate-200 bg-suporte-branco"
      >
        <div
          class="flex flex-wrap items-center gap-x-16px gap-y-8px
                 bg-linear-to-tr from-brand-600 to-brand-500 px-20px py-16px"
        >
          <div class="flex h-40px w-40px shrink-0 items-center justify-center rounded-[6px] bg-suporte-branco">
            <img src={produto.icone} alt="" class="h-24px w-24px object-contain" />
          </div>
          <h2 class="text-base font-semibold text-suporte-branco">{produto.nome}</h2>
          <span class="rounded-full bg-suporte-branco/20 px-8px py-2px text-xs text-suporte-branco">
            produto={produto.id}
          </span>
          <span class="text-xs text-suporte-branco/80">
            primeiro acesso {produto.jornada.primeiroAcesso ? 'sim' : 'não'} · MFA
            {produto.jornada.mfa ? 'sim' : 'não'}
          </span>
        </div>

        <ul class="grid grid-cols-1 gap-12px p-20px sm:grid-cols-2 lg:grid-cols-3">
          {#each variantes(produto) as v (v.nome)}
            {@const href = rota(v.caminho, produto.id, v.extras)}
            <li>
              <!-- O cartão inteiro é o link: numa parede de atalhos, alvo
                   pequeno é o que faz errar. -->
              <a
                {href}
                class="flex h-full flex-col justify-between gap-12px rounded-12px border
                       border-slate-200 px-14px py-12px transition-control
                       hover:border-brand-500 hover:bg-slate-50
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <div>
                  <p class="text-xs font-medium uppercase tracking-[0.06em] text-brand-700">
                    {v.grupo}
                  </p>
                  <h3 class="mt-4px text-sm font-medium text-slate-800">{v.nome}</h3>
                  {#if v.guarda}
                    <!-- A tela existe e explica que não se aplica: é estado de
                         tela, não link quebrado. -->
                    <span
                      class="mt-6px inline-block rounded-full bg-slate-100 px-8px py-2px text-xs text-slate-500"
                    >
                      guarda · {v.guarda}
                    </span>
                  {/if}
                </div>
                <code class="block truncate text-xs text-slate-400">{href}</code>
              </a>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </main>
</div>
