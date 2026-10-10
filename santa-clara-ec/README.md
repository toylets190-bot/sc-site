# Santa Clara Esporte Clube — site oficial

Site de clube de futebol feito só com **HTML, CSS e JavaScript puro** (sem build, sem dependências). Funciona abrindo o `index.html`, publica de graça no **GitHub Pages** e instala como **app** (PWA) no celular.

> Projeto fictício do *Santa Clara EC — Terror do Vale*, Mineiro Módulo II.

## O que o site tem

| Área | Funções |
|---|---|
| **Início** | Carrossel de destaques, próximo jogo com contador, faixa de resultados, notícias |
| **Futebol** | Calendário (com download `.ics` e lembretes), tabela, elenco, estatísticas, comparador de jogadores, retrospecto por adversário |
| **Meu Jogo** | Escolha o jogo: **em casa** libera ingressos, setores, validação e transmissão; **fora de casa** bloqueia isso e abre a ficha do estádio do mandante |
| **Torcedor** | Bilheteria digital com QR code, Vou ao Jogo, Guia de Acesso, Sócio (planos, carteirinha, pagamentos), Matilha Play (palpite, quiz, pênaltis, embaixadinhas), Fanzone (mural, álbum, simulador da tabela), Monte seu 11 |
| **Clube** | Ficha do clube, estádio, história e troféus, diretoria, comunidade, patrocinadores |
| **Institucional** | Transparência (documentos e conduta), Eventos e Espaços (orçamento e reserva com protocolo) |
| **Central do Torcedor** | Galeria, "Seja um Lobo" (pré-inscrição de peneiras), Retrospecto, Fale conosco / ouvidoria, Comparar jogadores |
| **Extras** | Loja com sacola, busca, modo claro/escuro, acessibilidade (fonte, contraste, reduzir movimento), funciona offline, instalável |

## Estrutura de pastas

```
santa-clara-ec/
├─ index.html              só a marcação da página
├─ css/
│  ├─ base.css             estilos base
│  ├─ polish.css           camadas de acabamento visual
│  └─ features.css         estilos das funções novas
├─ js/
│  ├─ config.js            ÁREA DE EDIÇÃO (jogos, elenco, notícias, contatos...)
│  ├─ jogos.js             central de jogos (gera calendário e próximo jogo)
│  ├─ data.js              banco de dados em memória
│  ├─ app.js               sócio, contas, ingressos, loja
│  ├─ ui-base.js · fanzone.js · extras.js
│  ├─ meu-jogo.js · polish.js · central.js · calendario.js · clube.js · institucional.js
│  └─ pwa.js               service worker e botão "instalar app"
├─ icons/                  ícones do app
├─ manifest.webmanifest    configuração do app instalável
├─ sw.js                   service worker (modo offline)
├─ 404.html · robots.txt
├─ tests/smoke.py          teste automático (Playwright)
├─ docs/                   guias de edição e arquitetura
└─ .github/workflows/      publicação (pages.yml) e testes (ci.yml)
```

## Rodar no seu computador

Opção simples: dê dois cliques no `index.html`.

Opção recomendada (o modo offline e o app instalável só funcionam por `http`):

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

## Editar o conteúdo

Tudo que muda no dia a dia está em **`js/config.js`**: resultados e próximos jogos, tabela, elenco, notícias, patrocinadores, contatos e redes. Veja o passo a passo em [`docs/GUIA-DE-EDICAO.md`](docs/GUIA-DE-EDICAO.md).

Os dois ajustes que mais importam logo de início:

1. `CONTATO` (WhatsApp e e-mail do clube): sem ele, as mensagens e pedidos feitos no site não chegam ao clube.
2. `REDES` (Instagram, YouTube etc.): só aparecem no rodapé as que você preencher.

## Publicar no GitHub Pages

```bash
cd santa-clara-ec
git init -b main
git add .
git commit -m "Primeira versão do site do Santa Clara EC"
git remote add origin https://github.com/SEU-USUARIO/santa-clara-ec.git
git push -u origin main
```

Depois, no GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
O workflow `pages.yml` publica o site a cada `push` na branch `main`. O endereço fica em
`https://SEU-USUARIO.github.io/santa-clara-ec/`.

**Domínio próprio:** em Settings → Pages → *Custom domain*, informe o domínio e aponte o DNS para o GitHub (o HTTPS é automático).

**Ao publicar uma versão nova do site:** troque o número de `VERSION` em `sw.js` (por exemplo `scec-v2`) para o modo offline entregar os arquivos novos.

## Testes

```bash
pip install -r requirements-dev.txt
python -m playwright install chromium
python tests/smoke.py
```

O teste abre o site em computador e celular e confere erros de JavaScript, seções, ids duplicados, links quebrados, acessibilidade básica, ausência de funções duplicadas e o funcionamento das funções principais. Ele roda sozinho no GitHub a cada `push` (`ci.yml`).

## Limitações (importante)

O site é **100% estático**: não há servidor nem banco de dados. Por isso:

- Contas, ingressos, pagamentos, protocolos de formulários, mural e álbum ficam salvos **só no navegador de quem usa**. Os pagamentos são uma simulação.
- Formulários (Fale conosco, Seja um Lobo, Eventos e Espaços) geram um protocolo no aparelho e oferecem enviar por WhatsApp ou e-mail quando `CONTATO` estiver preenchido. O clube não recebe nada automaticamente.
- Login real de sócio, cobrança de mensalidade, boleto/Pix e venda de ingresso de verdade exigem um sistema por trás (servidor, banco de dados e um meio de pagamento). Um caminho comum é Supabase ou Firebase para contas e dados, mais um gateway de pagamento. A estrutura do projeto já separa dados (`config.js`, `data.js`) da interface para facilitar essa troca.

## Licença

Defina a licença antes de abrir o repositório ao público (por exemplo MIT). Os escudos e imagens vêm de links externos (Imgur, Wikimedia): confirme os direitos de uso antes de publicar.
