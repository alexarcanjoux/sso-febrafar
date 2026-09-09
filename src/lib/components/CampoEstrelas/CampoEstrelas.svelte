<script>
  /**
   * CampoEstrelas — poeira de pontos girando em espiral, desenhada pixel a
   * pixel num `<canvas>`. É a textura de fundo do painel do AuthShell.
   *
   * COMO FUNCIONA. Cada estrela guarda uma órbita (distância até o centro) e
   * uma velocidade angular própria; a cada quadro ela é rotacionada em torno
   * do centro e deslocada por duas ondas senoidais defasadas — é a defasagem
   * que faz o conjunto ondular em vez de girar como um disco rígido. O alfa
   * sobe em `smoothstep` na primeira quinta parte do campo e cai até a borda
   * pela RAIZ da distância: a subida desfoca o miolo — a poeira nasce fraca
   * colada no símbolo em vez de fazer um aro duro em volta dele — e a raiz
   * segura o resto aceso mais longe, em vez de apagar a dois palmos dali.
   * Nada é `fillRect`: escrevemos direto no `Uint32Array` do
   * `ImageData`, que é o único jeito de mover 75 mil pontos por quadro sem
   * derrubar a taxa de quadros (~2,5 ms de conta por quadro, orçamento 16,7).
   *
   * AS DUAS MEDIDAS DO CAMPO SÃO SEPARADAS de propósito. `vazio` é o buraco
   * no meio, em px — vale o tamanho do símbolo que fica dentro dele, para a
   * poeira começar rente ao quadrado. `alcance` é até onde ela vai, medido em
   * metades da largura do painel: 1 põe a última estrela na borda lateral, e
   * mais que isso termina o campo FORA da vista — que é como se cobre o canto
   * do painel sem deixar a poeira morrer no meio da superfície, à vista.
   * Com um raio só, fechar o miolo puxava a borda de fora junto.
   *
   * ⚠️ O ALCANCE É RECALCULADO A CADA MEDIÇÃO, porque é relativo ao painel:
   * numa tela larga a poeira abre junto, em vez de virar uma mancha no meio
   * de um painel grande.
   *
   * O GIRO É LENTO DE PROPÓSITO: uma volta leva perto de um minuto. As
   * estrelas mais opacas giram mais rápido que as apagadas (`giro` é
   * multiplicado pelo alfa), e é essa diferença — não a velocidade — que dá o
   * arrasto de espiral. Rápido demais, o painel vira um cata-vento atrás de um
   * formulário de login.
   *
   * ⚠️ O CANVAS É TRANSPARENTE. Não pintamos fundo: quem dá a cor é o
   * `bg-brand-500` do painel atrás. Assim a mesma textura serve aos quatro
   * produtos sem receber a cor de fundo por prop.
   *
   * ⚠️ A COR DOS PONTOS VEM DO TEMA, LIDA EM TEMPO DE EXECUÇÃO. A prop é o
   * NOME de uma custom property (`--color-suporte-branco` no painel), não um
   * valor: o `getComputedStyle` resolve dentro do escopo `[data-produto]`, e
   * uma cor da rampa `brand-*` acompanha a marca do produto sem uma variante
   * por produto. Um hex fixo aqui tiraria essa possibilidade de quem usa.
   *
   * ⚠️ SÓ GIRA ENQUANTO `animando` FOR VERDADE — no painel, enquanto o
   * ponteiro estiver em cima. Parado, o campo continua desenhado: o que para é
   * o `requestAnimationFrame`, não a poeira. E o tempo é ACUMULADO, não lido
   * do relógio: com `(Date.now() - inicio)`, cada segundo parado viraria um
   * salto de ângulo na hora de voltar, e a poeira daria um pulo a cada hover.
   *
   * ⚠️ ENTRA E SAI EMBALANDO. O `animando` não liga e desliga o giro: move um
   * `impulso` de 0 a 1 (e de volta) por suavização exponencial, e é ele que
   * multiplica o avanço do tempo. Ligar no seco faz a poeira ARRANCAR e
   * ESTANCAR no meio do movimento, que é justamente o que se nota. Por isso o
   * laço não morre quando o ponteiro sai: ele continua até a poeira parar
   * sozinha, e só então se encerra.
   *
   * ⚠️ DECORATIVO. `aria-hidden` e `pointer-events-none`: não carrega
   * informação e não pode roubar o clique de nada do painel.
   *
   * @typedef {Object} Ponto
   * @property {number} x
   * @property {number} y
   *
   * @typedef {Object} Estrela
   * @property {number} orbita       Distância até o centro, em px
   * @property {number} opacidade    Alfa atual (0–255)
   * @property {number} onda1        Deslocamento vertical do quadro
   * @property {number} onda2        Deslocamento horizontal do quadro
   * @property {Ponto} posicao       Posição de partida, antes do giro
   * @property {Ponto} posicaoReal   Onde ela está agora — usada para apagar o rastro
   * @property {number} vGiro
   * @property {number} vOnda1
   * @property {number} vOnda2
   *
   * @typedef {Object} Props
   * @property {number} [estrelas]      Quantos pontos no total
   * @property {number} [vazio]         Raio do buraco no meio, em px
   * @property {number} [alcance]       Até onde a poeira vai, em metades da largura
   * @property {number} [onda]          Amplitude da ondulação, em px
   * @property {number} [opacidade]     Alfa no ponto mais forte do campo (0–255)
   * @property {number} [giro]          Velocidade angular da estrela mais opaca
   * @property {number} [ondulacao]     Velocidade das duas ondas
   * @property {boolean} [animando]     Gira enquanto for true; parado, fica estático
   * @property {string} [token]         Custom property com a cor dos pontos
   * @property {string} [class]         Classes extras no elemento raiz
   */

  /** @type {Props} */
  let {
    estrelas = 75000,
    vazio = 70,
    alcance = 1.5,
    onda = 14,
    opacidade = 69,
    giro = 0.0006,
    ondulacao = 0.006,
    animando = true,
    token = '--color-suporte-branco',
    class: classe = '',
  } = $props();

  /** Tempo característico do embalo, em ms: em ~3× isso o giro está cheio. */
  const EMBALO = 320;

  /** @type {HTMLDivElement | undefined} */
  let area = $state();
  /** @type {HTMLCanvasElement | undefined} */
  let tela = $state();

  /**
   * Resolve a custom property do tema em {r,g,b}.
   * Aceita `#rgb`, `#rrggbb` e `rgb()/rgba()` — que é tudo que a paleta usa.
   * Cai no branco se a variável não existir, para a textura nunca sumir calada.
   *
   * @param {Element} alvo
   * @returns {{ r: number, g: number, b: number }}
   */
  function corDoTema(alvo) {
    const bruto = getComputedStyle(alvo).getPropertyValue(token).trim();

    if (bruto.startsWith('#')) {
      const hex =
        bruto.length === 4
          ? bruto.slice(1).split('').map((c) => c + c).join('')
          : bruto.slice(1, 7);
      const n = Number.parseInt(hex, 16);
      if (Number.isFinite(n)) {
        return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
      }
    }

    const canais = bruto.match(/\d+(\.\d+)?/g);
    if (canais && canais.length >= 3) {
      const [r, g, b] = canais.map(Number);
      return { r, g, b };
    }

    return { r: 255, g: 255, b: 255 };
  }

  $effect(() => {
    // Lidas aqui de propósito: mexer em qualquer uma remonta o campo inteiro.
    const total = estrelas;
    const buraco = vazio;
    const ateOndeVai = alcance;
    const amplitude = onda;
    const alfaMax = opacidade;
    const vGiro = giro;
    const vOnda = ondulacao;

    const moldura = area;
    const contexto = tela?.getContext('2d');
    if (!moldura || !tela || !contexto) return;
    const canvas = tela;

    const cor = corDoTema(moldura);
    const paradoPorPreferencia = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const tamanho = { x: 0, y: 0 };
    // Distância entre o vazio e a última estrela. Sai da largura do painel,
    // então só tem valor depois da primeira medição.
    let espessura = 0;
    /** @type {ImageData} */
    let pixels;
    /** @type {Uint32Array} */
    let buffer;
    /** @type {Estrela[]} */
    let campo = [];
    let quadro = 0;
    let tempo = 0;
    let ultimoQuadro = 0;
    let lacoVivo = false;
    // 0 parado, 1 na velocidade cheia. `alvo` é para onde ele está indo.
    let impulso = 0;
    let alvo = 0;

    /**
     * Rotaciona (x,y) em torno de (cx,cy).
     *
     * @param {number} cx
     * @param {number} cy
     * @param {number} x
     * @param {number} y
     * @param {number} angulo
     * @returns {Ponto}
     */
    const rotacionar = (cx, cy, x, y, angulo) => {
      const cos = Math.cos(angulo);
      const sen = Math.sin(angulo);
      return {
        x: cos * (x - cx) + sen * (y - cy) + cx,
        y: cos * (y - cy) - sen * (x - cx) + cy,
      };
    };

    /**
     * Escreve um pixel no buffer.
     *
     * ⚠️ O X É CONFERIDO CONTRA A LARGURA, e não só o índice contra o tamanho
     * do buffer: um ponto que sai pela direita tem índice válido — o da linha
     * de baixo — e reapareceria colado na borda esquerda, uma costura visível.
     *
     * ⚠️ ORDEM DOS CANAIS. O `Uint32Array` sobre o buffer do `ImageData` é
     * lido na ordem do processador (little-endian em tudo que roda no
     * navegador hoje), então o alfa vai no byte mais alto e o vermelho no mais
     * baixo — o inverso da ordem RGBA em que o `ImageData` é declarado.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} valor
     */
    const pintar = (x, y, valor) => {
      const cx = Math.floor(x);
      const cy = Math.floor(y);
      if (cx < 0 || cx >= tamanho.x || cy < 0 || cy >= tamanho.y) return;
      buffer[cy * tamanho.x + cx] = valor;
    };

    /**
     * Alfa da estrela pela posição dela entre o vazio e a borda: sobe em
     * `smoothstep` até um quinto do caminho, cai pela raiz até o fim.
     *
     * ⚠️ O RUÍDO É MULTIPLICATIVO (0,7–1,0 do valor), e não somado. Somado, um
     * ruído fixo estouraria o teto onde o campo é forte e, pior, salpicaria de
     * pontos cheios justamente o miolo desfocado, desmanchando a única parte
     * do desenho que precisa ser suave.
     *
     * @param {number} orbita
     * @returns {number}
     */
    const alfa = (orbita) => {
      const t = (orbita - buraco) / espessura;
      const entrada = Math.min(1, Math.max(0, t / 0.22));
      const foco = entrada * entrada * (3 - 2 * entrada);
      const perfil = foco * Math.sqrt(Math.max(0, 1 - t));
      return Math.max(
        0,
        Math.min(255, Math.floor(perfil * alfaMax * (0.7 + Math.random() * 0.3)))
      );
    };

    const criarEstrela = () => {
      // O MENOR de dois sorteios, e não um sorteio direto: puxa as órbitas
      // para dentro. Sem isso a poeira sai uniforme por raio — e como a área
      // de cada anel cresce com o raio, uniforme por raio VIRA rala no meio e
      // grossa na borda, o inverso do desenho.
      const orbita =
        buraco + Math.min(Math.random(), Math.random()) * espessura;
      const opacidadeInicial = alfa(orbita);
      const posicao = rotacionar(
        tamanho.x / 2,
        tamanho.y / 2,
        tamanho.x / 2,
        tamanho.y / 2 + orbita,
        Math.PI * Math.random() * 2
      );

      campo.push({
        orbita,
        opacidade: opacidadeInicial,
        onda1: 0,
        onda2: 0,
        posicao,
        posicaoReal: { ...posicao },
        // O alfa entra na velocidade: quanto mais opaca, mais rápido a
        // estrela gira, e o campo ganha o arrasto de espiral. No original o
        // termo do alfa era `opacidade / 20000` — fixo, e tão maior que o
        // resto que a prop de velocidade não valia nada. Aqui ele MULTIPLICA
        // `giro`, então mexer na prop mexe no giro inteiro.
        vGiro: vGiro * (Math.random() + opacidadeInicial / 255),
        vOnda1: Math.random() * vOnda,
        vOnda2: Math.random() * vOnda,
      });
    };

    /** @param {Estrela} estrela */
    const desenharEstrela = (estrela) => {
      // Apaga onde ela estava: sem isso fica o rastro desenhado no buffer, que
      // nunca é limpo inteiro.
      pintar(
        estrela.posicaoReal.x + estrela.onda2,
        estrela.posicaoReal.y + estrela.onda1,
        0
      );

      estrela.onda1 = Math.sin(tempo * estrela.vOnda1) * amplitude;
      estrela.onda2 = Math.sin(tempo * estrela.vOnda2) * amplitude;
      estrela.posicaoReal = rotacionar(
        tamanho.x / 2,
        tamanho.y / 2,
        estrela.posicao.x,
        estrela.posicao.y,
        estrela.vGiro * tempo
      );
      estrela.opacidade = alfa(estrela.orbita);

      pintar(
        estrela.posicaoReal.x + estrela.onda2,
        estrela.posicaoReal.y + estrela.onda1,
        (estrela.opacidade << 24) | (cor.b << 16) | (cor.g << 8) | cor.r
      );
    };

    const desenhar = () => {
      for (const estrela of campo) desenharEstrela(estrela);
      contexto.putImageData(pixels, 0, 0);
    };

    const rodar = () => {
      const agora = Date.now();
      // Teto no passo: uma aba em segundo plano volta com um intervalo de
      // segundos, e sem o teto a poeira daria um salto no primeiro quadro.
      const passo = Math.min(agora - ultimoQuadro, 100);
      ultimoQuadro = agora;

      // Suavização exponencial: o impulso anda uma fração do que falta a cada
      // quadro, então acelera e desacelera sozinho. Escrita com `exp` para não
      // depender da taxa de quadros — a 30fps o embalo leva o mesmo tempo.
      impulso += (alvo - impulso) * (1 - Math.exp(-passo / EMBALO));
      tempo += (passo / 10) * impulso;
      desenhar();

      // Parou de valer a pena continuar: o ponteiro saiu E a poeira já está
      // praticamente imóvel. Um quadro a mais aqui não muda pixel nenhum.
      if (alvo === 0 && impulso < 0.002) {
        lacoVivo = false;
        return;
      }
      quadro = requestAnimationFrame(rodar);
    };

    const ligarLaco = () => {
      if (lacoVivo) return;
      lacoVivo = true;
      ultimoQuadro = Date.now();
      quadro = requestAnimationFrame(rodar);
    };

    const medir = () => {
      const x = Math.floor(moldura.clientWidth);
      const y = Math.floor(moldura.clientHeight);
      if (x === tamanho.x && y === tamanho.y) return;

      tamanho.x = x;
      tamanho.y = y;
      canvas.width = x;
      canvas.height = y;
      campo = [];
      // O painel só existe a partir de `lg`: abaixo disso ele mede 0×0, não há
      // o que desenhar e `createImageData(0, …)` lançaria.
      if (x === 0 || y === 0) return;

      // Metade da largura vezes o alcance: com `alcance` 1, a última estrela
      // cai na borda lateral do painel; acima disso, o campo acaba fora da
      // vista. O piso evita um campo degenerado nos painéis muito estreitos.
      espessura = Math.max(80, (ateOndeVai * x) / 2 - buraco);

      pixels = contexto.createImageData(x, y);
      buffer = new Uint32Array(pixels.data.buffer);

      // O campo nasce inteiro e já desenhado: como ele só gira no hover, a
      // poeira precisa estar lá antes de alguém passar o mouse. (Era aqui que
      // ficava a entrada gradual de 400 estrelas por quadro, que só fazia
      // sentido quando a animação começava sozinha.)
      while (campo.length < total) criarEstrela();
      desenhar();
    };

    const observador = new ResizeObserver(medir);
    observador.observe(moldura);
    medir();

    // Efeito ANINHADO: só ele lê `animando`, então entrar e sair do hover liga
    // e desliga o laço sem remontar as 50 mil estrelas — o que aconteceria se
    // a prop fosse lida no efeito de fora.
    $effect(() => {
      if (paradoPorPreferencia) return;
      alvo = animando ? 1 : 0;
      // Só o `true` precisa acender o laço: no `false` ele fica de pé sozinho
      // até a poeira desacelerar, e se encerra no próprio quadro.
      if (alvo === 1) ligarLaco();
    });

    return () => {
      observador.disconnect();
      cancelAnimationFrame(quadro);
    };
  });
</script>

<div bind:this={area} class="pointer-events-none {classe}" aria-hidden="true">
  <!-- O canvas tem a resolução em pixels de CSS (sem `devicePixelRatio`):
       cada estrela É um pixel, e multiplicar a área por 4 numa tela retina
       quadruplicaria o trabalho por quadro para deixar a poeira mais fina do
       que ela deve ser. -->
  <canvas bind:this={tela} class="block h-full w-full"></canvas>
</div>
