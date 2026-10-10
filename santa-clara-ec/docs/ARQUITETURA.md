# Arquitetura

O projeto é estático e **não usa módulos nem bundler**. Cada arquivo `.js` é um *script clássico* carregado pelo `index.html` na ordem abaixo. Todos compartilham o escopo global (funções e variáveis `const` de um arquivo ficam visíveis aos seguintes).

> **Não reordene os `<script>`.** Vários arquivos dependem do que o anterior definiu.

## Ordem de carregamento

| # | Arquivo | Onde | Responsabilidade |
|---|---|---|---|
| 1 | `js/boot.js` | `<head>` | Plano B do QRCode, escudos (`TEAM_LOGOS`), tratadores de imagem que falha |
| 2 | `js/config.js` | fim do `<body>` | `window.EDITAR`: todo o conteúdo editável |
| 3 | `js/jogos.js` | | Gera `JOGOS`, `PROXIMO_JOGO` e `CALENDARIO` a partir de `EDITAR.PARTIDAS` |
| 4 | `js/data.js` | | `DB` em memória e renderização das seções principais |
| 5 | `js/app.js` | | Sócio, contas, ingressos, loja, notificações |
| 6 | `js/ui-base.js` | | Acessibilidade de modais e imagens, topo e calendário |
| 7 | `js/fanzone.js` | | Mural, álbum e simulador da tabela |
| 8 | `js/extras.js` | | Validação, busca, pagamentos, Matilha Play e acréscimos |
| 9 | `js/meu-jogo.js` | | Escolha o jogo (em casa × fora) |
| 10 | `js/polish.js` | | Movimento e acabamento visual |
| 11 | `js/central.js` | | Central do Torcedor; exporta `window.__ct` |
| 12 | `js/calendario.js` | | Download `.ics` |
| 13 | `js/clube.js` | | Menu, carrossel, ficha do clube, patrocinadores, rodapé |
| 14 | `js/institucional.js` | | Transparência e Eventos e Espaços (usa `window.__ct`) |
| 15 | `js/pwa.js` | | Service worker e instalação |

CSS: `base.css` → `polish.css` → `features.css` (a ordem define a cascata).

## Convenções

- Dados do usuário ficam em `localStorage` com prefixo `scec_` (`scec_user`, `scec_peneiras`, `scec_atend`, `scec_espacos`, `scec_jogo_sel`, `scec_a11y`...).
- Funções de interface expostas para `onclick` ficam no `window` (`ctOpen`, `tkPickByDate`, `jgPick`, `calAll`, `exInstallOpen`).
- Novas funções entram em um arquivo próprio, adicionado ao `index.html` **antes** de `js/pwa.js`, e o CSS em `css/features.css`.
- Mudou arquivos? Atualize `VERSION` e a lista `CORE` em `sw.js`.

## Pontos de integração

- **Escolha o jogo → seções:** `meu-jogo.js` bloqueia/libera `#ingressos`, `#estadio`, `#vou-ao-jogo`, `#guia-acesso`, `#validacao` e `#transmissao` (lista `LOCK` no início do arquivo).
- **Central → formulários:** `central.js` exporta `window.__ct = { field, check, proto, send, ls, esc }`, reaproveitado por `institucional.js`. `ctOpen(aba, { ass, msg })` abre a Central já com assunto e mensagem preenchidos.
- **Trocar para um backend:** substitua as chamadas a `localStorage` (`ls()` em `central.js`, contas em `app.js`) por chamadas à sua API.
