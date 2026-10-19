# Qualidade das aulas completas — 19/10/2026

## Correções

- O tema compartilhado sobrescrevia a cor do link de retorno no cabeçalho escuro. Uma regra restrita a `.course-top a` mantém o texto branco e a área de interação com altura mínima de 44 px.
- O primeiro atalho de teclado permite pular para as atividades. Sua ação move o foco para o conteúdo sem alterar o hash que identifica a aula ou voltar ao catálogo.
- A troca de etapa leva o foco e a rolagem para o conteúdo da atividade. A abertura inicial conserva a apresentação da aula e a ordem natural do teclado.
- Os 12 botões de áudio do vocabulário têm nomes acessíveis que identificam cada expressão.
- O jogo de ordenação não registra erro enquanto a sequência está vazia ou incompleta. A orientação pede todas as palavras antes de conferir. Sequências completas erradas continuam registrando erro e podem ser reconstruídas.
- Uma mensagem explica a necessidade de JavaScript caso os exercícios interativos não possam executar.

## Verificação

Suíte estática completa e build aprovados. Dois testes de comportamento executam a função de ordenação publicada com controles simulados: sequência vazia/incompleta não registra resposta; sequência completa errada registra erro, e reconstrução correta registra acerto.

No navegador foram confirmados: primeiro Tab no atalho, Enter levando o foco ao conteúdo sem mudar a rota, nomes de áudio por expressão, aviso de sequência incompleta, foco e rolagem na atividade ao navegar, cor branca sobre cabeçalho escuro e ausência de rolagem horizontal em 390 × 844 px.

Não houve mudança no catálogo, nos IDs, nos requisitos de conclusão, no armazenamento, no acesso, nos pagamentos ou no service worker. A verificação em tela pequena foi feita no navegador; não equivale a uma validação em aparelhos físicos ou com leitores de tela reais.
