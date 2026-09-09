<script>
  /**
   * AuthShell — moldura de todas as telas de acesso do SSO.
   *
   * Cartão flutuante sobre fundo slate: a tela inteira é um cartão branco
   * arredondado, com a coluna de formulário à esquerda e um painel na cor da
   * marca — em degradê de um passo, ver o `aside` — encaixado à direita (lg+). Abaixo de lg o painel some e sobra a
   * coluna — numa tela de login o painel é contexto, não conteúdo.
   *
   * O painel NÃO TEM TEXTO DE MARKETING: é o símbolo do produto num quadrado
   * branco, a propagação saindo dele até as bordas (ver LinhasDoCentro) e o
   * selo de ambiente seguro no pé. Quem lê a tela está lendo o formulário, e uma
   * frase do outro lado só disputa atenção com ele — a marca se apresenta pela
   * cor e pelo símbolo. O selo fica porque não é marketing: é o que diz a quem
   * vai digitar a senha que a página é a certa.
   *
   * É aqui que a marca troca: o `data-produto` no elemento raiz coloca a
   * escala `brand` do produto em escopo (ver themes/produtos.css), então
   * botão, foco, link e acentos do painel mudam juntos, sem classe condicional.
   *
   * @typedef {import('../../produtos.js').Produto} Produto
   *
   * @typedef {Object} Props
   * @property {Produto} produto
   * @property {string} titulo                       Título da tela (h1)
   * @property {string} [descricao]                  Texto de apoio abaixo do título
   * @property {string} [voltarHref]                 Exibe o link de voltar quando presente
   * @property {string} [voltarTexto]
   * @property {import('svelte').Snippet} children   Conteúdo da coluna (formulário)
   * @property {import('svelte').Snippet} [rodape]   Substitui o rodapé padrão da coluna
   * @property {import('svelte').Snippet} [painel]   Substitui o conteúdo do painel lateral
   */

  import { PRODUTOS, PRODUTO_PADRAO } from '../../produtos.js';
  import { LinhasDoCentro } from '../LinhasDoCentro/index.js';

  /** @type {Props} */
  let {
    produto,
    titulo,
    descricao,
    voltarHref,
    voltarTexto = 'Voltar para o login',
    children,
    rodape,
    painel,
  } = $props();

  const ano = new Date().getFullYear();

  // A marca do topo é sempre a do produto, e no login da Febrafar o produto é
  // a própria Febrafar — por isso a assinatura do pé só existe fora dela: seria
  // a mesma logo duas vezes na mesma tela.
  const ehFebrafar = $derived(produto.id === PRODUTO_PADRAO);
  const logoFebrafar = PRODUTOS[PRODUTO_PADRAO].logo;

  // O ponteiro em cima do painel é o que solta os pulsos nas linhas. Fora do
  // hover os traços continuam desenhados, só sem luz correndo — e a tela
  // parada é a que a maioria vai ver, já que quem chega aqui vai digitar do
  // outro lado.
  //
  // Só `enter` e `leave`: o painel não escuta `pointermove`. Escutava, quando
  // havia um brilho seguindo o cursor, e cada movimento do mouse remontava o
  // gradiente do elemento.
  let ponteiroNoPainel = $state(false);

</script>

<div data-produto={produto.id} class="min-h-screen bg-suporte-branco p-12px md:p-24px">
  <!-- Sem sombra nem fundo cinza: o cartão é branco sobre branco, então o
       único elemento que se destaca da página é o painel escuro. -->
  <div class="flex min-h-[calc(100vh-24px)] md:min-h-[calc(100vh-48px)] overflow-hidden rounded-24px bg-suporte-branco lg:p-8px">
    <!-- Coluna do formulário -->
    <div class="flex w-full flex-col px-20px py-28px md:px-48px md:py-36px lg:w-1/2">
      <!-- A logo vive na mesma coluna de 400px dos campos, centralizada sobre
           eles — assim ela pertence ao formulário, não à borda da tela.

           É SEMPRE A LOGO DO PRODUTO, inclusive no login da Febrafar, onde o
           produto é ela mesma. Quem chega aqui veio de um sistema e precisa
           reconhecer no topo o sistema de onde veio; a Febrafar aparece no pé,
           assinando (ver o rodapé). -->
      <div class="mx-auto w-full max-w-[400px]">
        <img
          src={produto.logo}
          alt={produto.logoAlt ?? produto.nome}
          class="mx-auto h-36px w-auto"
        />
      </div>

      <div class="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-40px">
        {#if voltarHref}
          <a
            href={voltarHref}
            class="mb-16px inline-flex items-center gap-6px self-start rounded-4px text-sm font-medium text-slate-500
                   transition-control hover:text-brand-700
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14 6l-6 6 6 6" />
            </svg>
            {voltarTexto}
          </a>
        {/if}

        <h1 class="text-2xl font-semibold tracking-[-0.01em] text-slate-800">{titulo}</h1>
        {#if descricao}
          <p class="mt-4px text-sm text-slate-500">{descricao}</p>
        {/if}

        <div class="mt-28px">
          {@render children()}
        </div>
      </div>

      {#if rodape}
        {@render rodape()}
      {:else}
        <footer class="flex flex-col items-center gap-14px">
          <!-- ⚠️ A ASSINATURA É DA FEBRAFAR, E NÃO DO PRODUTO. O topo da coluna
               já diz em qual sistema a pessoa está entrando; o pé responde a
               outra pergunta — de quem é a conta que ela vai usar para entrar —,
               e a resposta é a rede, a mesma nos quatro produtos.

               Pequena, sem link e acima da linha de miudezas: é uma assinatura,
               não uma segunda navegação no fim de uma tela que tem uma ação só.

               `width`/`height` reais do arquivo (390×105) além do `h-20px`:
               reservam o espaço antes de a imagem carregar, senão o rodapé pula
               de altura no primeiro carregamento.

               `alt="Febrafar"` e não vazio: fora do login da Febrafar esta
               marca não aparece em nenhum outro lugar da tela, então um `alt`
               vazio esconderia de quem lê por leitor de tela justamente a
               informação que a assinatura existe para dar. -->
          {#if !ehFebrafar}
            <img
              src={logoFebrafar}
              alt="Febrafar"
              width="390"
              height="105"
              class="h-20px w-auto"
            />
          {/if}

          <div class="flex flex-wrap items-center justify-center gap-x-8px gap-y-4px text-xs text-slate-400">
            <span>© {ano} Febrafar</span>
            <span aria-hidden="true">·</span>
            <a
              href="https://febrafar.com.br/politica-de-privacidade"
              class="rounded-4px transition-control hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              Privacidade
            </a>
          </div>
        </footer>
      {/if}
    </div>

    <!-- Painel lateral (lg+) — um degradê de um passo só, do canto inferior
         esquerdo (brand-600) para o superior direito (brand-500).

         ⚠️ UM PASSO DA RAMPA, E NÃO DOIS. É a diferença entre uma superfície
         com luz e uma superfície pintada de duas cores: em azul, #0b5292 →
         #0d5ea7 é quase imperceptível parado, e o que se vê é o canto de cima
         abrir. Com brand-700 embaixo o painel viraria um fundo de banner, e a
         marca do produto passaria a ser dois tons em vez de um.

         ⚠️ AS DUAS PONTAS SÃO DA RAMPA DA MARCA, sempre. Houve uma versão em
         que o Pulse puxava o laranja do símbolo dele para a ponta de baixo: o
         painel deixava de ser rosa e a tela perdia a cor do produto. O degradê
         é sombreado da marca, não uma segunda cor. -->
    <aside
      class="relative hidden w-1/2 flex-col justify-end overflow-hidden rounded-20px
             bg-linear-to-tr from-brand-600 to-brand-500 px-40px py-48px lg:flex"
      onpointerenter={() => (ponteiroNoPainel = true)}
      onpointerleave={() => (ponteiroNoPainel = false)}
    >
      <!-- A propagação: rotas que saem do quadrado, dão a volta num anel com
           o formato dele e seguem até as bordas, com um pulso de luz correndo
           por cima — o único efeito do painel. A poeira de pontos que ficava
           aqui (`CampoEstrelas`, que continua no pacote) saiu: duas texturas na
           mesma superfície competem, e o traço com um pulso viajando diz sozinho
           o que a névoa dizia junto.

           ⚠️ OS ANÉIS SÃO DO `LinhasDoCentro`, e não elementos daqui. Já foram
           cinco divs neste painel, atrás do card: o pulso corria por baixo de
           uma moldura que não tinha nada a ver com ele. Anel e linha no mesmo
           `path` é o que faz a volta ser parte do trajeto.

           Vem ANTES do quadrado no DOM, e é a ordem que esconde por baixo do
           card — que é opaco — os 50px em que todas as linhas nascem no mesmo
           ponto.

           Corre só no hover: uma tela de login em repouso não precisa de nada
           se mexendo nela enquanto alguém digita a senha do outro lado. -->
      <LinhasDoCentro class="absolute inset-0" animando={ponteiroNoPainel} />

      <!-- ⚠️ POSICIONADO PELO `inset-0`, e não pelo fluxo do painel. As rotas
           nascem no centro do SVG, que ocupa o painel inteiro; centrar o
           símbolo entre o topo e o selo o deixaria uns 30px acima disso, e as
           linhas apareceriam saindo de fora do quadrado. -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        {#if painel}
          {@render painel()}
        {:else}
          <!-- 100×100 e raio 14px exatos, e não tokens de espaçamento e de
               raio: são as medidas do quadrado no desenho, e é delas que sai o
               formato dos anéis (14% de raio, ver LinhasDoCentro) — mexer aqui
               muda a propagação inteira. O fundo branco tira o símbolo da
               regra de contraste da marca: ele fica igual em azul, âmbar, roxo
               e magenta, sem uma variante por produto. -->
          <div
            class="flex h-[100px] w-[100px] items-center justify-center rounded-[14px]
                   bg-suporte-branco shadow-lg"
          >
            <!-- `alt` vazio: o nome do produto já está na logo do formulário,
                 do outro lado da mesma tela. Repetir aqui só faria o leitor de
                 tela anunciar a marca duas vezes. -->
            <img src={produto.icone} alt="" class="h-56px w-56px object-contain" />
          </div>
        {/if}
      </div>

      <!-- Rodapé do painel: pílula branca, centralizada na largura do painel.
           O fundo branco tira o selo da regra de contraste da marca — ele fica
           igual em azul, âmbar, roxo e magenta, que é o que se espera de um
           indicador de segurança. -->
      <div class="relative flex justify-center">
        <span class="inline-flex items-center gap-8px rounded-full bg-suporte-branco px-16px py-8px text-xs font-medium text-slate-700 shadow-md">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="text-green-500" aria-hidden="true">
            <path d="M12 2.2 4.4 5.6v5.6c0 4.7 3.2 8.6 7.6 9.6 4.4-1 7.6-4.9 7.6-9.6V5.6L12 2.2z" />
            <path
              d="m10.9 15.2-3-3 1.4-1.4 1.6 1.6 3.8-3.8 1.4 1.4-5.2 5.2z"
              fill="var(--color-suporte-branco)"
            />
          </svg>
          Ambiente seguro
        </span>
      </div>
    </aside>
  </div>
</div>
