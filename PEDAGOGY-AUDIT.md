# Auditoria pedagógica — ISM Business English

Data: 29/09/2026. Escopo: inventário, verificação estrutural e leitura editorial integral dos 256 registros de lição identificados abaixo, incluindo versões legadas. Após a primeira rodada, todos os campos foram relidos em lotes pequenos sem truncagem. A leitura do agente não equivale a certificação CEFR, revisão humana dupla ou validação com alunos. O arquivo checklist-editorial-por-licao.md registra cada lição, status e achado.

## Cobertura e fontes

| Conjunto | Cobertura observada |
|---|---|
| Core remoto | 98 lições, módulos 1–12; fontes ism-course-content, ism-phase3-content e ism-phase4-content. Todos os campos lidos, incluindo objetivos, contextos, expressões, traduções, notas, alternativas, feedback e produção. Camada adicional de expressões/dicas ism-course-content-v2 também lida. |
| P1 entrevistas remoto | 30 lições, módulos 13–17; fonte ism-interview-content. Todos os campos de cada lição lidos. |
| P2 escrita remoto | 8 lições; leitura integral dos registros de lição. |
| P3–P8 remoto legado | 50 registros lidos integralmente; não foram contados como 50 lições adicionais ao catálogo local de mesmas trilhas. |
| Premium local P3–P9 | 57 lições: 7+8+9+8+9+9+7. Todos os campos lidos, incluindo glossários, lacunas e alternativas aceitas, modelos, critérios, notas, links e diálogos. |
| Prática ampliada local | 13 unidades: 1.1–1.8, 13.6, 14.6, 15.6, data-trends e data-proposal. Todos os campos lidos; cálculos de percentuais e pontos percentuais examinados. |
| Escuta local | Banco de 50 diálogos P3–P8 e 7 diálogos P9 lido integralmente junto às respectivas lições, incluindo alternativas, gabaritos e feedback. Trata-se de revisão dos roteiros, não de certificação acústica. |
| Complementos | Comparação britânico/americano, descrições de duas entrevistas externas e 8 cenários Real Business examinados. Não foi realizada audição integral dos vídeos externos. |

As fontes remotas foram obtidas pelo conector Supabase, somente com leitura durante o inventário. Há snapshots de trabalho separados da aplicação. A tentativa HTTP pelo terminal foi bloqueada pelas permissões de rede; o acesso aos fontes pelo conector funcionou. Não foram coletados dados de alunos nem segredos.

## Correções executadas

1. **Modelo de apresentação 13.6:** a instrução pedia 60–90 palavras, mas o modelo era menor. O modelo agora tem **66 palavras**, apresenta função, responsabilidades, experiência anterior e conexão com a vaga. Arquivo: practice-content.js.
2. **Modelo STAR 15.6:** a rubrica exigia resultado e aprendizado, mas o modelo terminava no resultado. A tarefa e o modelo agora incluem explicitamente Learning, com Action mais detalhada do que Situation. IDs e gabaritos preservados. Arquivo: practice-content.js.
3. **Core 1.4:** o exercício penalizava “What do you think?” em uma pergunta vaga sobre neutralidade. A pergunta foi reformulada para distinguir pedir opinião, oferecer a própria opinião e perguntar prazo. O feedback afirma que “What do you think?” também é inglês neutro válido no contexto adequado. Fonte versionada: supabase/functions/ism-course-content/index.ts.
4. **Core 1.3:** a regra absoluta “report to — never report for” passou a explicar especificamente a relação de reporte a um gestor. Isso evita ensinar uma proibição que extrapola o sentido trabalhado. Mesma fonte do Core.
5. **P2.4:** “Record a polite follow-up” foi substituído por tarefa de escrita com referência à mensagem anterior e próximo passo. A tarefa agora corresponde ao campo de texto e ao objetivo Professional Writing. Fonte versionada: supabase/functions/ism-premium-content/index.ts.

6. **Core 3.5 e Premium local P4.2:** confirmar o offset atual pode produzir horário incorreto em uma reunião futura após mudança de horário de verão. Expressões, tradução e atividade passaram a exigir o offset aplicável na data da reunião.
7. **Premium legado P4.4:** o exemplo “by end of day Friday” contrariava o objetivo de resolver ambiguidade entre escritórios. Agora informa 17:00 UTC e pede confirmação da data no convite.
8. **P1 15.1:** corrigida regência na tradução para “Dê um exemplo de um conflito com o qual você lidou.”

Após revisão e autorização do responsável principal, as funções de conteúdo implantadas ficaram em: ism-course-content **versão 9**, ism-premium-content **versão 3** e ism-interview-content **versão 2**. A configuração existente verify_jwt=false e a ausência de import map foram preservadas. Não houve alteração de autorização ou gateway por este agente. A correção local P4.2 deverá compor o pacote/frontend consolidado pelo responsável principal.

Uma nova leitura remota confirmou igualdade exata entre as três fontes implantadas e suas cópias corrigidas. Isso confirma a implantação do código, não substitui um teste HTTP externo: terminal e ferramenta web não conseguiram acessar os endpoints nesta sessão. O responsável principal pode complementar a validação pelo navegador conectado. O agente de acesso Premium foi informado para atualizar snapshots e candidatos de autorização antes de sua implantação.

## Verificação reproduzível

Executar na raiz do repositório: `node scripts/pedagogy-content-check.mjs`.

Resultado: **PASS** para 57 lições Premium locais, 13 unidades ampliadas, índices de alternativas e escuta, faixa de palavras da apresentação, reflexão STAR, offset na data da reunião, prazo explícito e tradução de P1. Respostas das funções Core/Premium/P1 foram executadas em ambiente de teste.

Verificações adicionais do inventário: 98 Core, 30 P1 e 58 registros Premium remotos com gabaritos existentes; não foram encontrados índices apontando para alternativas inexistentes. O teste das cópias corrigidas preservou 51 lições na função Core original e 58 na função Premium legada. `node --check practice-content.js` passou.

Uma tentativa inicial de executar `scripts/practice-content-check.mjs` identificou que esse arquivo não existia; não foi contabilizada como teste aprovado. O novo teste reproduzível acima cobre as alterações efetivas.

## Qualidade preservada e próximos controles editoriais

Os conteúdos locais favorecem objetivos profissionais concretos, produção própria, comparação com modelo e autoavaliação. Os exemplos de dados distinguem percentual de ponto percentual e evitam inventar causalidade. A comparação UK/US trata variantes como tendências e preserva ambas como válidas. O uso de present perfect/simple past foi conferido com o [British Council](https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/british-english-american-english).

Ainda há muitos distratores obviamente inadequados (“insultar”, “ignorar”, “nunca perguntar”), especialmente no Core remoto. Eles funcionam para reconhecimento inicial, mas pouco discriminam competência intermediária. Uma evolução editorial deve introduzir alternativas plausíveis que variem intenção, escopo, evidência e próximo passo, com piloto de alunos e revisão de dificuldade antes de substituir todos os itens.

A camada ism-course-content-v2 acrescenta “None of the above” a exercícios com três opções, sem gerar casos novos em que essa opção seja correta. Isso não quebra o gabarito, mas adiciona uma alternativa previsível; deve ser reavaliado junto ao desenho dos exercícios, sem alteração indiscriminada nesta rodada.

Limitações explícitas: não houve aferição CEFR, revisão humana dupla, estudo de validade dos escores, audição integral das entrevistas, verificação especializada de todas as fontes jurídicas/tributárias/técnicas de P9 ou observação longitudinal de aprendizagem. As lições de P9 foram avaliadas como ensino de vocabulário e compreensão; este relatório não certifica aconselhamento jurídico, fiscal ou técnico. Não se declara “todo o conteúdo certificado”.
