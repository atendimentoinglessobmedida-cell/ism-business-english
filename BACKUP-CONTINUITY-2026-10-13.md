# Continuidade do aluno — 13/10/2026

A restauração agora apresenta uma prévia dos registros válidos, substituições e entradas incompatíveis. O aluno pode cancelar sem alterar seus dados. A confirmação baixa um backup do estado anterior antes de aplicar a restauração. O arquivo continua no formato `ism-business-backup-v1`.

Somente namespaces conhecidos de aprendizagem e preferências são aceitos. Sessões, permissões e credenciais não são transportadas; restaurar progresso Premium não concede acesso ao conteúdo protegido. Objetivo profissional, rascunhos e as coleções Premium original e aplicada mantêm seus namespaces separados.

A exportação consulta também os registros do IndexedDB que não foram abertos na página atual. A restauração valida todo o arquivo antes de escrever, limita o tamanho a 2 MB, rejeita estruturas inválidas e usa uma transação para os registros do IndexedDB. Se a gravação local falhar, tenta desfazer as gravações locais e informa que a operação não foi concluída, sem declarar sucesso. O backup anterior baixado permite recuperação quando o navegador também impede desfazer uma gravação.

Validação: 31 checks de navegador em 320/390/768/1280 px; prévia, cancelamento, confirmação, backup anterior, reload, exclusão de acesso, entrada inválida, limite de tamanho, falha parcial de escrita e exportação com IndexedDB. Suíte estática e build aprovados. Jornada de produto em 360/390/768/1280 px aprovada após adaptar o teste para abrir a área expansível do Coach. PWA aprovada com preservação de rascunhos, Core offline e recusa de Premium offline. Cache público v84.

Ainda pendentes: homologação com alunos e aparelhos físicos; escuta humana dos diálogos; validação acompanhada de login, contratação, renovação e vencimento reais. Transferência entre aparelhos usa arquivo de backup; sincronização automática autenticada não foi implementada nesta entrega.
