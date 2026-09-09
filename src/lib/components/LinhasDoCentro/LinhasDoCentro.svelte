<script>
  /**
   * LinhasDoCentro — a propagação do painel: cada rota sai do quadrado do
   * símbolo, dá uma volta inteira num anel com o formato dele e segue até a
   * borda, com um pulso de luz percorrendo esse caminho todo.
   *
   * ⚠️ ANEL E LINHA SÃO O MESMO `path`, e é isso que faz o efeito ler como uma
   * coisa só. Enquanto os anéis eram divs no AuthShell e as linhas viviam aqui,
   * o pulso corria POR BAIXO de uma moldura que não tinha nada a ver com ele —
   * dois desenhos empilhados no mesmo centro. Junto, o pulso entra no anel,
   * contorna e sai: a volta passou a ser parte do trajeto, não um enfeite que
   * ele atravessa.
   *
   * ⚠️ A GEOMETRIA É CALCULADA EM PIXELS, não escrita à mão num `viewBox`
   * fixo. O painel é metade de um cartão que muda com a janela: um `viewBox`
   * de tamanho fixo esticaria os cantos e a espessura do traço junto com ele.
   * Aqui o SVG tem o tamanho medido do elemento e os caminhos são remontados a
   * cada medição.
   *
   * ⚠️ TODA ROTA COMEÇA NO CENTRO, embaixo do quadrado. O card é opaco e cobre
   * os primeiros 50px, então o traço parece sair da borda dele — sem precisar
   * calcular em que ponto da borda cada um encosta.
   *
   * ⚠️ O RAIO DO CANTO É 14% DO LADO, e não um valor em px. São os 14px sobre
   * os 100 do quadrado do símbolo: é o que mantém o MESMO formato do card em
   * todos os tamanhos de anel. Em px cravado, o canto do anel maior ficaria
   * proporcionalmente reto e a família se perderia.
   *
   * ⚠️ O PULSO USA `pathLength="100"`, e não o comprimento real. Com ele, o
   * `stroke-dasharray` passa a ser lido em porcentagem do caminho: o pulso tem
   * o mesmo tamanho relativo e leva o mesmo tempo na rota curta e na longa.
   * Com o comprimento real, a rota que dá a volta no anel maior ficaria lenta e
   * a de dentro, um estalo.
   *
   * ⚠️ OS CINCO PULSOS SAEM JUNTOS, sem atraso entre eles. Saíam escalonados,
   * um a cada quinto da duração, e o painel virava um trânsito de luzes soltas
   * em cinco caminhos — cada uma um evento seu. Partindo no mesmo instante do
   * mesmo ponto, são UMA onda deixando o símbolo; como os caminhos têm
   * comprimentos diferentes e o `pathLength` iguala o tempo de todos, a onda se
   * abre sozinha ao longo do trajeto, que é o que se quer de uma propagação.
   *
   * ⚠️ NÃO PARA NO SECO. Fora do hover os pulsos somem por transição e a
   * animação fica PAUSADA no ponto em que estava (`animation-play-state`), em
   * vez de reiniciar do começo na volta — parar e voltar do zero é justamente
   * o que se nota.
   *
   * @typedef {Object} Rota
   * @property {string} d           Caminho SVG
   * @property {number} opacidade   Opacidade do trilho fixo
   *
   * @typedef {Object} Props
   * @property {boolean} [animando]   Corre o pulso enquanto for true
   * @property {number} [duracao]     Tempo de uma passada do pulso, em s
   * @property {string} [class]       Classes extras no elemento raiz
   */

  /** @type {Props} */
  let { animando = false, duracao = 10, class: classe = '' } = $props();

  /** Raio do canto, em fração do lado — os 14px do quadrado de 100 do símbolo. */
  const RAIO = 0.14;

  /**
   * Piso do lado menor do painel, em px, para dimensionar os anéis.
   *
   * Existe por causa do anel de dentro: em `lg` estreito o painel tem uns
   * 500px, e 17% disso seriam 85px — MENOR que o quadrado de 100 do símbolo,
   * some atrás do card. Com o piso ele nasce em 133px, uns 16px de folga de
   * cada lado do quadrado, em qualquer largura de painel.
   */
  const PISO = 780;

  /**
   * Os cinco anéis, de dentro para fora.
   *
   * ⚠️ MAIS FORTE PERTO DO SÍMBOLO, sumindo em direção à borda: a onda nasce no
   * quadrado, e o que se afasta perde força. Invertido, o painel ganharia uma
   * moldura acesa na borda e um buraco no meio — vinheta, não propagação.
   *
   * ⚠️ O ESPAÇO ENTRE ELES CRESCE (~1,35× a cada anel), e não é decoração: em
   * passo constante os cinco lêem como um alvo de tiro. Abrindo, lêem como algo
   * que se espalha e perde velocidade.
   *
   * O `giro` é por onde a rota entra e por onde ela sai depois da volta — 0
   * direita, 1 baixo, 2 esquerda, 3 cima. Quatro direções em cinco rotas: o
   * desenho fica assimétrico de propósito, porque cinco saídas simétricas
   * leriam como diagrama.
   *
   * ⚠️ O `sentido` DA VOLTA ALTERNA, E ISSO NÃO É ESCOLHA ESTÉTICA — É UMA
   * TRAVA. 1 é horário, -1 anti-horário. Com os cinco girando para o mesmo
   * lado, os pulsos correm juntos (saem no mesmo instante) e, no trecho em que
   * cada um está passando por um canto do seu anel, o painel mostra quatro ou
   * cinco marcas em "L" dobrando todas para a mesma direção, em posições
   * rodadas de 90° em volta do mesmo centro. Isso é a forma de uma suástica, e
   * não importa que dure meio segundo nem que ninguém tenha desenhado isso: uma
   * tela de login com o símbolo de uma marca no meio não pode piscar aquilo.
   * Sentidos misturados quebram a leitura na origem — braços que dobram para
   * lados diferentes não fecham a figura.
   *
   * Pelo mesmo motivo as linhas são RETAS do centro até fora do painel, sem os
   * cotovelos que a versão antiga tinha: raio reto que atravessa não vira braço
   * de nada. Se um dia alguém quiser cotovelos de volta, esta nota vale como
   * aviso de que a combinação cotovelo + rotação de 90° + mesmo sentido é
   * exatamente o que precisa ser evitado.
   */
  const ANEIS = [
    { fracao: 0.17, opacidade: 0.26, giro: 0, sentido: 1 },
    { fracao: 0.235, opacidade: 0.2, giro: 3, sentido: -1 },
    { fracao: 0.32, opacidade: 0.15, giro: 2, sentido: 1 },
    { fracao: 0.435, opacidade: 0.11, giro: 1, sentido: -1 },
    { fracao: 0.58, opacidade: 0.08, giro: 0, sentido: -1 },
  ];

  /** @type {HTMLDivElement | undefined} */
  let area = $state();
  let largura = $state(0);
  let altura = $state(0);

  $effect(() => {
    if (!area) return;
    const alvo = area;
    const medir = () => {
      largura = Math.floor(alvo.clientWidth);
      altura = Math.floor(alvo.clientHeight);
    };
    const observador = new ResizeObserver(medir);
    observador.observe(alvo);
    medir();
    return () => observador.disconnect();
  });

  /** @type {Rota[]} */
  const rotas = $derived.by(() => {
    if (!largura || !altura) return [];

    const cx = largura / 2;
    const cy = altura / 2;
    const base = Math.max(Math.min(largura, altura), PISO);
    // Passa de qualquer borda a partir do centro: o que sobra o painel corta,
    // e o pulso sai de cena em vez de parar em cima da borda.
    const alcance = Math.max(largura, altura);

    /**
     * Gira um ponto dado em distâncias do centro e devolve a coordenada
     * absoluta. Uma rota só é desenhada saindo para a direita; o giro de 90°
     * em torno do centro é o que dá as outras três direções sem uma segunda
     * versão do caminho.
     *
     * @param {number} dx @param {number} dy @param {number} giro
     * @returns {string}
     */
    const ponto = (dx, dy, giro) => {
      const [rx, ry] = [
        [dx, dy],
        [-dy, dx],
        [-dx, -dy],
        [dy, -dx],
      ][giro];
      return `${(cx + rx).toFixed(1)} ${(cy + ry).toFixed(1)}`;
    };

    return ANEIS.map((anel) => {
      const s = (anel.fracao * base) / 2;
      const r = anel.fracao * base * RAIO;
      // O `sentido` espelha o caminho no eixo da entrada: o anel é simétrico
      // nesse eixo, então o desenho não muda — só a ordem em que ele é
      // percorrido, que é o que faz a volta ser horária ou anti-horária.
      const p = (/** @type {number} */ dx, /** @type {number} */ dy) =>
        ponto(dx, anel.sentido * dy, anel.giro);

      return {
        opacidade: anel.opacidade,
        // Centro → entra no meio do lado do anel → volta inteira, no sentido
        // do anel, terminando no mesmo ponto → segue reto até fora do painel.
        d: [
          `M ${p(0, 0)}`,
          `L ${p(s, 0)}`,
          `L ${p(s, s - r)}`,
          `Q ${p(s, s)} ${p(s - r, s)}`,
          `L ${p(-s + r, s)}`,
          `Q ${p(-s, s)} ${p(-s, s - r)}`,
          `L ${p(-s, -s + r)}`,
          `Q ${p(-s, -s)} ${p(-s + r, -s)}`,
          `L ${p(s - r, -s)}`,
          `Q ${p(s, -s)} ${p(s, -s + r)}`,
          `L ${p(s, 0)}`,
          `L ${p(alcance, 0)}`,
        ].join(' '),
      };
    });
  });
</script>

<div bind:this={area} class="pointer-events-none {classe}" aria-hidden="true">
  <svg
    class="block h-full w-full"
    width={largura}
    height={altura}
    viewBox="0 0 {largura} {altura}"
    fill="none"
  >
    {#each rotas as rota, i (i)}
      <!-- O trilho: é ele que desenha o caminho quando nada está correndo. A
           opacidade vem do anel, então a rota inteira — linha e volta — desbota
           junto conforme se afasta do símbolo. -->
      <path d={rota.d} class="trilho" style="stroke-opacity: {rota.opacidade}" />
      <!-- O pulso. `pathLength` normaliza o caminho em 100, então o traço de
           14 é sempre 14% dele. -->
      <path
        d={rota.d}
        pathLength="100"
        class="pulso"
        class:correndo={animando}
        style="animation-duration: {duracao}s"
      />
    {/each}
  </svg>
</div>

<style>
  .trilho {
    fill: none;
    stroke: var(--color-suporte-branco);
    stroke-width: 1;
  }

  .pulso {
    fill: none;
    stroke: var(--color-suporte-branco);
    stroke-opacity: 0;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-dasharray: 14 86;
    animation-name: correr;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    /* Nasce pausado: só o hover solta. */
    animation-play-state: paused;
    transition: stroke-opacity 400ms ease-out;
  }

  .pulso.correndo {
    stroke-opacity: 0.55;
    animation-play-state: running;
  }

  @keyframes correr {
    from {
      stroke-dashoffset: 100;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  /* Sem movimento: fica só o trilho. O pulso parado no meio do caminho seria
     um risco solto no painel, que é pior que não ter pulso nenhum. */
  @media (prefers-reduced-motion: reduce) {
    .pulso {
      display: none;
    }
  }
</style>
