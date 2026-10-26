# Prompt de melhoria — auditoria UX, pedagogia, design e desenvolvimento

## Objetivo e contexto

Melhorar o ISM Business English a partir dos problemas comprovados na auditoria independente do agente `auditoria_integral`, preservando o conteúdo e o progresso existente. Trabalhar na branch `global-text-alignment-recovery` e manter o PR sem merge. A revisão abrangeu implementação, fluxos e amostras pedagógicas locais; não equivale a revisão linguística integral de todas as lições ou certificação em aparelhos físicos.

## Prompt executável

Corrija os problemas comprovados de UX e aprendizagem: inclua notas zero válidas nas métricas, sem transformar ausência em erro; use a mesma pontuação de autoavaliação Speaking no módulo e no caderno, preservando evidências antigas de três critérios; abra a lição específica nos CTAs de reforço, validando identificadores; ofereça prática oral com autoavaliação mesmo sem microfone ou após recusa de permissão; permita repetir a gravação e libere recursos ao navegar; associe Speaking de Real Business ao cenário e a um componente visível; torne o modal acessível em abertura, Escape, fechamento e reabertura; calcule prazos reais de revisão; e substitua comandos de desenvolvimento inexistentes por comandos do app estático.

Esclareça a escala de autoavaliação e a diferença entre autoavaliação e avaliação automática. Preserve exemplos profissionais, tentativa antes de modelo, feedback, critérios de conclusão e armazenamento compatível. Não crie alegações de medição de pronúncia. Verifique legibilidade, estados vazios/erro e navegação por teclado. Execute testes de comportamento e regressão nas larguras 360, 390, 768 e 1280px; publique alterações somente na branch de revisão e aguarde o CI e ambos os previews.

## Critérios de aceitação

1. Exercícios com 0 e 100 resultam em média 50; zero aparece no reforço e registros sem nota são ignorados.
2. Uma evidência com clareza 3, fluidez 3, linguagem 3 e ação 1 resulta em 83% nas duas telas; evidência antiga 3/3/3 continua em 100%.
3. Reforço da lição 2.1 chama a lição 2.1, sem abrir continuação genérica; identificadores inválidos não geram ações arbitrárias.
4. Sem MediaRecorder ou com permissão negada, a pessoa pode praticar e registrar os quatro critérios.
5. Gravar, parar e repetir funciona; sair do painel libera o microfone, inclusive pedidos pendentes.
6. A tentativa de Real Business tem identidade própria (`real-business:<cenário>`), sem contaminar a última lição Core.
7. O modal recebe foco em cada abertura, possui título associado e devolve foco ao disparador ao fechar.
8. Revisão vencida informa disponibilidade, não um prazo futuro fictício.
9. Build e QA documentados executam arquivos existentes, verificam recursos publicados e falham em erro.

## Execução desta rodada

Implementados os itens acima em adaptive-coach.js, my-business-english.js, speaking-experience.js, real-business.js, index.html, speaking-experience.css e comandos/documentação de desenvolvimento. Adicionado scripts/product-browser-check.cjs com fixtures de evidências e simulação de gravação/permissão. O getter de COUNTS também permite ao Coach calcular progresso do objetivo a partir dos módulos reais.

## Etapas estruturais seguintes

- Unificar catálogo/progresso Premium com migração compatível: Core usa o catálogo legado 88/8; hub possui catálogo e chaves diferentes. Não somar ou substituir silenciosamente.
- Planejar controle efetivo de acesso Premium e expiração, separadamente do registro comercial existente.
- Revisão linguística integral do corpus com inventário de lições e conteúdo remoto; a amostragem atual não justifica reescrita geral.
- Validar microfone real, permissões e instalação em Android/iOS. A simulação de browser verifica o código, não qualidade acústica ou hardware.

Esses itens permanecem explicitamente fora da execução desta rodada por envolverem migração, autorização de acesso ou validação física, e não devem ser anunciados como concluídos.
