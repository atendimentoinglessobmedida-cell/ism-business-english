# ISM Business — revisão de confiabilidade — 21/10/2026

A revisão executou a suíte estática geral: contratos de navegação, progresso, conteúdo Regular e Premium, proteção dos arquivos publicados, áudio, revisões por três aulas, produção e build. Esses testes não equivalem a certificação de uso em todos os aparelhos.

No Ideas Lab foram identificados e corrigidos os seguintes problemas:

- As autoavaliações eram gravadas apenas ao finalizar; agora cada alteração é salva.
- A conclusão aceitava critérios desmarcados; agora exige os três critérios e as 20 palavras já previstas.
- Editar o texto mantinha a conclusão da versão anterior; agora exige nova revisão e preserva a data histórica da conclusão anterior.
- O salvamento direto em localStorage podia interromper a atividade em falhas de armazenamento; agora usa ISMStorage, recuperação e backup do app, preservando a chave legada.
- O áudio não tinha interrupção explícita ao sair ou ocultar a página; agora tem.
- O campo de escrita e botões de áudio receberam rótulos acessíveis. Há contador de palavras e ajuste do campo à largura disponível.

Validação: cinco novos testes comportamentais aprovados; suíte scripts/qa-static.mjs completa e build aprovados. No navegador local foram verificados bloqueio da conclusão incompleta, retomada do rascunho e de checkbox após recarga, conclusão válida, limpeza após edição e largura de 390 px sem rolagem horizontal.

Limites: sem validação auditiva humana nesta etapa, sem instalação ou offline em aparelhos físicos e sem novo teste de conta Premium real. As rotas e credenciais Premium não foram modificadas. Os demais três apps não fazem parte desta entrega.
