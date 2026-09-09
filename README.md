# SSO Febrafar

Telas de acesso compartilhadas por todas as soluções Febrafar: login,
recuperação e definição de senha, primeiro acesso e verificação em duas
etapas. Uma conta, uma senha, as mesmas telas — muda a marca, não o fluxo.

SvelteKit 5 + Tailwind v4 + adapter Cloudflare, a mesma stack do
`fideliza-mais-componentes` e do PEC.

```bash
npm install
npm run dev      # http://localhost:5173
npm run check    # svelte-check
npm run build
npm run cf:deploy
```

## Telas

| Rota                | O que é                                                    |
| ------------------- | ---------------------------------------------------------- |
| `/login`            | E-mail + senha. Bifurca para MFA ou devolve ao produto      |
| `/esqueci-senha`    | Pede o e-mail e dispara o link de redefinição               |
| `/email-enviado`    | Confirmação do envio, com reenvio em contagem regressiva    |
| `/redefinir-senha`  | Nova senha a partir do `?token=` do e-mail                  |
| `/primeiro-acesso`  | Senha inicial do usuário convidado (`?convite=`) — opcional |
| `/verificacao`      | Código de 6 dígitos (MFA) — opcional                        |
| `/senha-alterada`   | Fim do fluxo de senha                                       |

`/` redireciona para `/login` preservando a query.

Primeiro acesso e MFA são **opcionais por jornada**: cada produto declara se
usa em `src/lib/produtos.js`. Quem cai numa dessas rotas com o produto que não
as usa vê a explicação e o caminho de volta, não um formulário morto.

## Marca por produto

O produto vem da URL — `/login?produto=pec`. Sem parâmetro, é o guarda-chuva
Febrafar.

A estrutura das telas é toda `slate` + branco. A escala `brand` aparece só nos
pontos de ação e identidade: botão primário, foco, link, acentos do painel.
O `AuthShell` escreve `data-produto="<id>"` no elemento raiz e, como no
Tailwind v4 as utilitárias compilam para `var(--color-brand-500)`, redefinir a
variável nesse escopo re-tematiza tudo de uma vez — sem classe condicional,
sem componente duplicado.

### Conectar um produto novo

1. **Escala** em `src/lib/themes/produtos.css`, sob `[data-produto='<id>']`.
2. **Logo** em `static/logos/<id>.svg` (versão colorida, para fundo claro).
3. **Registro** em `src/lib/produtos.js`: nome, tagline, logo, `jornada` e
   `retorno`.

⚠️ `--color-brand-contraste` é o texto que vai **em cima** de `brand-500`
(botão primário, checkbox marcado). Marca clara pede tom escuro: branco sobre
o âmbar do PEC dá 2.15:1 e reprova em qualquer critério de contraste.

## Design System

Recorte do Fideliza DS — só o que uma tela de acesso usa:

- **Do DS**: `Button`, `Input`, `FormField`, `Label`, `Icon`, `Checkbox`,
  `Divider`, `Loading`, `LoadingButton`, mais os tokens em
  `src/lib/styles/foundations.css`.
- **Deste projeto**: `AuthShell` (moldura), `Aviso` (mensagem inline),
  `ForcaSenha` (medidor + checklist), `CodigoInput` (MFA) e `FormNovaSenha`
  (formulário compartilhado entre primeiro acesso e redefinição).

Tudo é importado por `$lib/index.js`, a superfície pública.

Três componentes vindos do DS foram adaptados: `Button`, `LoadingButton` e
`Checkbox` usam `text-brand-contraste` no lugar do branco fixo, porque aqui a
marca troca por produto. `LoadingButton` também ganhou `type` (para enviar
formulário) e o tamanho `xl`.

## Backend

**Nenhuma tela fala com servidor ainda.** Todo o contato passa por
`src/lib/sso.js`, hoje um conjunto de stubs que respondem com atraso para
exercitar os estados de carregamento. Trocar o corpo de cada função por
`fetch` é a única mudança necessária — as telas só conhecem esse módulo.

Para demonstrar os caminhos de erro:

- senha `errada` → credencial recusada
- código `000000` → código inválido
- URL sem `token` / `convite` → link expirado

As regras de senha em `src/lib/validacao.js` são conveniência de interface. O
backend precisa reaplicar cada uma delas.
