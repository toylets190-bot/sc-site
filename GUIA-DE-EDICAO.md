# Guia de edição

Todo o conteúdo do site está em `js/config.js`, dentro de `window.EDITAR = { ... }`.
Abra o arquivo em um editor de texto (VS Code, por exemplo), mude o que precisar, salve e recarregue o site.

> **Cuidado com a sintaxe:** mantenha as vírgulas entre itens e as aspas fechadas. Se algo ficar errado, o site mostra um aviso vermelho no topo em vez de quebrar em silêncio.

## Resultados e próximos jogos (o mais usado)

Em `PARTIDAS`, uma linha por jogo. O site inteiro acompanha: próximo jogo, contador, calendário, último resultado, tabela, retrospecto e Meu Jogo.

```js
{ rodada: 9, adv: 'EC Montes Claros', data: '2026-10-11', hora: '16:00', emCasa: false, gols: null, golsAdv: null },
```

- **Jogo que ainda vai acontecer:** `gols: null, golsAdv: null`.
- **Jogo realizado:** preencha `gols` (Santa Clara) e `golsAdv` (adversário).
- **`emCasa`:** `true` quando o Santa Clara é mandante (vende ingresso e libera tudo). `false` quando é visitante (sem ingresso, mostra o estádio do mandante).
- **Adiar um jogo:** troque só `data` e `hora`. **Adicionar:** copie uma linha e cole no fim.
- Opcionais por jogo: `comp`, `local`, `portoes` (`'13:30'`), `arbitragem`, `escalacao`, `sigla`.
- Jogos já passados sem placar entram em `PENDENCIAS_RESULTADO` e o site avisa no console do navegador até você preencher.

## Contatos e redes (comece por aqui)

```js
CONTATO: { whatsapp: '5538999999999', email: 'contato@santaclara.com.br' },   // WhatsApp só com números e DDI
REDES: { instagram: 'https://instagram.com/...', youtube: '', x: '', tiktok: '', facebook: '', canalWhatsapp: '' },
```

Com `CONTATO` preenchido, aparecem os botões "Enviar por WhatsApp / e-mail" em Fale conosco, Seja um Lobo e Eventos e Espaços. `REDES` mostra no rodapé só os links preenchidos (precisam começar com `https://`).

## Estádio dos adversários (jogos fora de casa)

```js
ESTADIOS_ADVERSARIOS: {
  'EC Montes Claros': { estadio: 'Nome do estádio', cidade: 'Montes Claros — MG', endereco: '...', capacidade: '...', setor: 'Onde fica a torcida visitante', contato: 'Site ou telefone', obs: 'Aviso extra' }
}
```

O que ficar vazio aparece como "a confirmar com o mandante".

## Eventos, documentos, espaços e conduta

```js
EVENTOS: [{ titulo: 'Festa da Matilha', data: '2026-11-05', hora: '19:00', local: 'Toca do Lobo', tipo: 'Torcida', desc: 'Entrada gratuita' }],   // o próximo evento entra no carrossel da home
DOCUMENTOS: [{ titulo: 'Estatuto social', tipo: 'Estatuto', ano: 2024, url: 'https://...' }],                  // vazio = documentos padrão para solicitar
ESPACOS: [{ emoji: '🏟️', nome: 'Estádio Vale de Santa Clara', desc: 'Eventos corporativos e gravações.' }],      // vazio = espaços padrão
CONDUTA: ['Respeito acima de tudo.', 'Valide o ingresso antes de entrar.'],                                       // vazio = regras padrão
GALERIA: [{ src: 'https://...jpg', legenda: 'Clássico do Vale' }],                                              // vazio = usa as imagens do site
```

## Outras seções

| Chave | O que controla |
|---|---|
| `CORES` | Cores do clube aplicadas no site todo |
| `TABELA` | Classificação dos outros times (a posição do Santa Clara é calculada sozinha) |
| `PATROCINADORES` | Cartões de patrocinadores e a faixa rolando acima do rodapé |
| `NOTICIAS` | Notícias, categorias, imagens e texto completo |
| `ELENCO` | Jogadores (número, posição, idade, jogos, gols, atributos) |
| `HISTORIA` / `TROFEUS` | Linha do tempo e sala de troféus |
| `DIRETORIA` / `COMISSAO_TECNICA` | Quem aparece em Diretoria e Comissão Técnica |
| `ESPLANADA` | Informações da esplanada da Toca do Lobo |
| `SOCIOS` | Número de sócios exibido |

## Imagens

Os escudos ficam em `window.TEAM_LOGOS` (`js/boot.js`) e as demais imagens são links (Imgur etc.). Para usar imagens suas, coloque os arquivos em uma pasta `img/` e use caminhos como `img/escudo.png`. Se um link falhar, o site mostra a sigla do clube no lugar.

## Depois de editar

1. Abra o site e confira.
2. Rode `python tests/smoke.py` (opcional, mas recomendado).
3. Faça `git add . && git commit -m "Atualiza jogos" && git push`: o GitHub Pages publica sozinho.
