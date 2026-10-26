# Revisão do ISM Business English — 14/09/2026

Revisão por amostragem do frontend publicado em github-pages-preview. Não constitui certificação integral das 98 lições nem teste com alunos. Preservados os conteúdos e as chaves independentes de progresso Core, P1, P2 e prática complementar.

| Área | Avaliação e correções | Próxima melhoria |
|---|---|---|
| Usabilidade | Corrigido exercício P2 que bloqueava as opções após erro sem oferecer nova tentativa. Filtro Toolkit agora mostra a categoria selecionada. | Padronizar nomes em português nos controles, nomear botões de ícones e reduzir opções simultâneas no cabeçalho. |
| Design | Etapas Core agora têm botões de pelo menos 44px, quebra de linha e foco visível. Lição e exercício P2 verificados a 390px; Toolkit a 1366px, sem transbordamento horizontal observado. | Auditoria visual de todas as telas, inclusive zoom de 200%, contraste dos estados e aparelhos menores. |
| Conteúdo pedagógico | Plano de ação P1 exige os três campos preenchidos. Revisão complementar exige uma nova tentativa, impedindo registrar novamente as respostas antigas. Corrigida descrição desatualizada das trilhas Premium. | P2 precisa de critérios próprios por tarefa, revisão guiada do texto, melhores distratores e exemplos comentados. Preencher campos ou atingir 20 caracteres não comprova competência. |
| Navegabilidade | Context, Learn, Listen, Notice, Practice, Speak e Concluir passam a navegar para a seção correspondente. Retirada etapa quando não existe conteúdo correspondente. | Endereços próprios para cada lição e suporte consistente ao Voltar do navegador; retorno do complemento à lição original. |
| Fluidez | Abertura da lição Core passa a devolver sua operação assíncrona e tratar falha de carregamento com aviso. | Indicador de carregamento, limite de espera e proteção contra respostas antigas após trocar de tela; salvar rascunhos de simulações e builders. |
| Robustez | Leitura defensiva nos três cursos, aviso de falha de salvamento e bloqueio de sobrescrita de registro ilegível. Prática complementar normaliza estruturas inválidas e sequências duplicadas. | Exportação/importação de backup, recuperação assistida, validação profunda dos registros e sincronização autenticada entre dispositivos. |

## Verificação realizada

- Validação sintática dos scripts das três páginas alteradas e dos scripts auxiliares.
- Testes isolados: registro JSON null preservado sem sobrescrita; salvamento válido; falha de quota; plano de ação vazio rejeitado e preenchido aceito; estado complementar malformado normalizado; tentativa antiga impedida de avançar a revisão.
- Navegador local com conteúdo remoto real: P2 primeira lição, resposta incorreta e botão Tentar novamente reabilitando alternativas; Core Continuar aprendendo, primeira lição e salto para Practice; filtro Data selecionado e lista correspondente.
- Capturas visuais em 390px nos exercícios Core e P2. Medida de largura sem transbordamento em 390px e 1366px. Nenhum erro de console retornado na verificação Core.

## Limites e prioridades

1. Próxima prioridade pedagógica: rubricas de escrita por objetivo, tarefas de reformulação e revisão após feedback. Realizar piloto com alunos antes de interpretar estrelas como evidência de domínio.
2. Próxima prioridade técnica: rascunhos, backup e recuperação de progresso. O aviso de falha não transforma armazenamento local em sincronização; telas podem mostrar conclusão em memória mesmo se não foi salva.
3. Próxima prioridade de navegação: rotas de lições, histórico e controle de requisições lentas.
4. O Email Builder ainda requer revisão de pontuação ao combinar pedido e prazo. Não foi alterado nesta rodada.
5. Não testados nesta rodada: Android físico, microfone, todas as lições, todas as simulações, funcionamento offline e pagamentos. Áudio depende das vozes disponíveis; feedback heurístico não mede pronúncia ou precisão gramatical.
6. Não foram alterados preços, condições comerciais, pagamentos, backend ou registros de alunos em produção.
