# Changelog

## 1.2.0
- Nova seção **Desempenho** (menu Futebol e menu do celular): forma recente, aproveitamento casa × fora, cartões com números animados, gráfico de pontos acumulados, lista de resultados, próximos jogos e botão de compartilhar a campanha. Tudo calculado sozinho a partir de `PARTIDAS` em `js/config.js`.
- Jogo já disputado e sem placar em `PARTIDAS` aparece como "Resultado a confirmar" em vez de sumir do site.
- Acabamento visual: sublinhado dourado nos títulos, botões com resposta ao toque, seleção de texto e barra de rolagem nas cores do clube.
- `VERSION` do service worker: `scec-v3`.

## 1.1.0
- Corrigido: botão "Perguntas e contato" do destaque "Seja sócio" dava erro (cada botão do carrossel agora chama a própria ação).
- Corrigido: copiar link / Pix / escalação não gera mais erro quando o navegador nega a área de transferência (usa método alternativo).
- Áreas de toque maiores no celular (ícone 🔗, pontos do carrossel, chips, rodapé), sem mudar o visual.
- Service worker: instalação tolerante a falhas, limpeza exata de caches antigos, página 404 offline e `VERSION` = `scec-v2`.
- Novos testes automáticos para os itens acima.

## 1.0.0
- Projeto organizado em pastas (`css/`, `js/`), com área de edição separada em `js/config.js`.
- Meu Jogo: jogos em casa liberam ingressos e setores; jogos fora bloqueiam e abrem a ficha do estádio do mandante.
- Central do Torcedor (galeria, Seja um Lobo, retrospecto, Fale conosco, comparar jogadores), Transparência e Eventos e Espaços.
- Menu em grupos, carrossel de destaques, ficha do clube, faixa de patrocinadores e rodapé com contato e redes.
- Funções duplicadas removidas (pênalti, quiz, mural, palpite, checklist, botões de topo, barras de progresso, acessibilidade).
- PWA: instalável e funciona offline. Acessibilidade: link "Pular para o conteúdo", rótulos nos campos, um único `<h1>`.
- Teste automático (Playwright) e publicação no GitHub Pages por GitHub Actions.
