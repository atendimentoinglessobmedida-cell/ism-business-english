# Melhoria das imagens e navegação visual

Avaliação e implementação concluídas com agente especialista em design. O prompt completo está em plano-design-imagens.md (também VISUAL-DESIGN-PROMPT.md no repositório).

## Entrega

- Quatro SVGs redesenhados: reuniões, apresentações, negociação e chamada com cliente. Paleta coesa navy/turquesa/creme/âmbar, cenas humanas distintas. Total 12.110 bytes, sem fontes externas ou filtros caros. Capas e retrato do professor preservados.
- Imagens inteiras em proporção 16:9, sem recortar rostos. Títulos, traduções e ações em HTML fora da imagem. Rótulos continuam utilizáveis quando a imagem falha.
- Figuras de lição posicionadas após o objetivo, com seleção baseada em título/contexto e sem duplicação nas atualizações da página. Fundos navy evitam faixas laterais contrastantes.
- Miniaturas compactas nas sete trilhas de prática aplicada Premium, sem alterar progresso, ordem de atividades ou acesso.
- Cache PWA v67 para atualizar a família visual; Core offline e regras de autorização preservados.

## Validação

- Especialista inspecionou capturas atuais mobile e desktop e aprovou acabamento/hierarquia.
- Cenários e lição em 320/390/768/1280px: proporção, rótulos, quatro destinos, foco/teclado, imagem indisponível, movimento reduzido, ausência de overflow/erros JS.
- Premium390/1280: todas as sete imagens carregadas e decodificadas após rolagem, rascunhos e conclusões preservados após reload. Gateway simulado para isolar UI/progresso.
- Regressão de alinhamento em oito larguras320–1280 e produto em quatro larguras360–1280 aprovadas.
- Atualização PWA: remoção cache anterior, progresso preservado, Core offline e novas consultas Premium recusadas offline. Teste passou após esperar explicitamente a troca do controlador Service Worker.
- QA estático, contratos pedagógicos/autorização e build aprovados. Os testes de Speaking usam microfone simulado; não certificam aparelhos físicos.

## Arquivos principais

assets/visual-meetings.svg, visual-presentations.svg, visual-negotiation.svg, visual-client-call.svg; visual-learning.js/css; premium-study.js; premium.html; sw.js. Testes visual-design-browser-check.cjs, premium-progress-browser-check.cjs, visual-learning-check.mjs e sincronização do teste pwa-browser-check.cjs.

Nenhum merge ou publicação em produção nesta entrega. As condições de liberação física e do acesso Premium documentadas anteriormente permanecem pendentes.
