# ISM Business English — avaliação e prompt de desenvolvimento visual

Avaliação realizada por agente especialista em design visual em 29/09/2026. Base: assets locais, `visual-learning.js`, `visual-learning.css`, estrutura de `premium-study.js` e capturas `index-html-390.png` e `premium-html-1280.png`. As capturas existentes representam estados anteriores: usar novas capturas para aprovar a entrega atual.

## Diagnóstico

- A identidade azul profundo e turquesa já é reconhecível e tem bom potencial. Preservar marca, hierarquia pedagógica e destaque da próxima ação.
- As quatro cenas `assets/visual-*.svg` são leves (2,3–2,8 KB), porém seus personagens rígidos, quase idênticos, e fundos em azul, roxo, marrom e verde criam aparência de biblioteca genérica. O desenho comunica pouco da interação entre pessoas.
- `.visual-scene img` usa altura fixa e `object-fit:cover`; em duas colunas mobile o formato fica próximo do quadrado, recortando cenas originais 16:9. O rótulo sobreposto invade a imagem. A melhoria não depende apenas de trocar o arquivo: é necessário corrigir o enquadramento.
- A escolha de imagem em `visual-learning.js` procura palavras em todo o corpo da lição. Uma palavra mencionada no exemplo pode classificar equivocadamente a cena. As legendas orientam o aluno a interpretar uma ilustração genérica que nem sempre contém evidência suficiente para a atividade.
- O catálogo Premium é uma sequência longa de cartões visualmente semelhantes. Pequenos marcadores visuais por tema podem melhorar orientação sem inserir grandes banners repetidos.
- As capas do curso e Premium têm aproximadamente 1,78 MB e 1,74 MB. São peças promocionais com texto incorporado e retrato. Preservar identidade e conteúdo original; não usá-las como substituto de instruções em HTML nem como decoração em todas as lições. Otimizar distribuição apenas com ferramenta autorizada e conferir legibilidade.

## Direção visual

Editorial profissional acolhedor: navy, turquesa, branco quente e pequenos acentos âmbar. Pessoas adultas diversas em colaboração concreta, sem caricatura infantil, poses de banco de imagens ou excesso de objetos. Uma linguagem de imagem consistente, sem textos/logotipos gerados. Imagens devem ajudar a reconhecer situações; o conteúdo didático e a ação principal continuam dominantes.

## Prompt executável

Atue como designer e desenvolvedor do ISM Business English. Execute as cinco etapas abaixo preservando o fluxo de estudos, acesso Premium, áudio, respostas e progresso. Não faça merge nem declare QA físico concluído sem evidência.

1. **Produzir uma família visual coesa.** Criar quatro cenas horizontais: reunião colaborativa, apresentação de resultados, negociação respeitosa e chamada com cliente. Usar ilustração editorial refinada com luz suave e ambiente profissional contemporâneo; variedade de tons de pele, gêneros e idades; ações compreensíveis; contraste entre personagens e ambiente; composição segura no centro e margem para recortes. Não incluir palavras, números, marcas ou promessas de aprendizado. Refinar diretamente os quatro SVGs nativos editáveis, preservando viewBox 1200×675, title e desc acessíveis. Não usar filtros caros nem texto embutido. A ferramenta image_gen permanece alternativa para um requisito futuro de raster; não foi aplicada nesta execução. Revisar visualmente anatomia, gestos, coerência e legibilidade em miniatura antes de integrar.

2. **Corrigir navegação visual da página inicial.** Em `visual-learning.js` e `visual-learning.css`, manter quatro atalhos, rótulos HTML legíveis e contextualizados em português, imagem em proporção 16:9, nome/ação fora da região de recorte. Duas colunas mobile e quatro desktop, sem corte de rostos. Preservar destinos existentes, foco de teclado, área clicável de pelo menos 44 px e preferência por movimento reduzido. Imagem decorativa com `alt=""` quando o rótulo do botão já descreve a ação. Usar dimensões explícitas e carregamento adiado fora da primeira tela.

3. **Aproximar ilustrações do contexto pedagógico.** Preferir título/contexto da lição ou metadado explícito ao texto completo para selecionar cena. Não atribuir significado pedagógico específico a uma imagem genérica. Limitar altura do cabeçalho de `.lesson-visual` e `.businessmode-visual`; manter instruções e botões facilmente alcançáveis no celular. Legenda curta, sem alegar que a imagem contém pistas que não possui. Não duplicar a imagem após observações/mutações do DOM.

4. **Dar orientação ao catálogo Premium.** Em `premium-study.js`/`premium-courses.css`, adicionar miniatura ou marcador temático discreto a `.premium-track-card`, com mapeamento explícito de módulos. Evitar repetição de grandes imagens nas nove trilhas e não confundir miniatura com novo botão. Preservar títulos, contagens e andamento. Não modificar retrato do professor nem introduzir uma representação gerada apresentada como sendo ele. Reusar a mesma família visual para contextos equivalentes.

5. **Validar e entregar.** Verificar Home, lição, Business Mode e catálogo Premium em 320, 390, 768 e 1280 px; testar teclado, foco, movimento reduzido, imagens indisponíveis e navegação real dos atalhos. Garantir ausência de overflow, distorção, texto encoberto e mudanças de layout causadas por carregamento. Executar suítes estáticas e regressões existentes de estudo, áudio e progresso. Verificar todos os assets no build e no Service Worker. Se criar caminhos novos, atualizar precache/versionamento para disponibilização offline coerente. Produzir capturas antes/depois e relatório com arquivos, tamanho dos assets, testes executados e limitações. Publicar apenas no candidato/PR sem misturar mudanças de licenciamento.

## Critérios de aceitação

- Quatro cenas claramente distintas, com acabamento e paleta consistentes.
- Rótulos compreensíveis mesmo sem imagens; nenhum texto essencial dentro de raster.
- Sem rostos cortados ou imagens esticadas nas quatro larguras.
- Próxima ação de estudo mantém prioridade; imagens não tornam navegação mais longa sem necessidade.
- Nenhum novo pedido externo de imagem a terceiros; assets locais, otimizados e disponíveis no build.
- Meta de menos de 15 KB por cena SVG e menos de 60 KB para a família completa. Esses valores são metas de produto, não aprovação automática de desempenho.
- Testes de acesso, progresso e áudio existentes continuam passando. Aparência aprovada por inspeção de capturas recentes; não confundir teste simulado com aparelho físico.

## Revisão das capturas finais

- `design-cenarios-390.png` e `design-cenarios-1280.png`: quatro cenas novas aprovadas. Reunião, apresentação, negociação e videochamada reconhecíveis, mesma linguagem visual, sem rosto cortado. Rótulos e destinos permanecem legíveis fora das imagens.
- `design-licao-390.png`: título e objetivo precedem a figura, e o exercício permanece próximo. O responsável aplicou a recomendação de igualar o fundo da área de imagem ao navy do SVG para eliminar barras laterais creme do ajuste `contain`.
- A primeira captura longa Premium mostrava miniaturas ainda não carregadas. A rotina foi corrigida para rolar cada imagem e confirmar `naturalWidth > 0`. `design-premium-card-390.png` foi então inspecionada: miniatura renderizada, alinhamento com título adequado, imagem discreta sem competir com progresso e ação. Cartão aprovado visualmente.
- Relato do responsável pela integração: teste automatizado completo passou em 320, 390, 768 e 1280 px. Esta revisão visual não equivale a teste em aparelho físico.

