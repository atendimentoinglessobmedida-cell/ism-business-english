# Ciclo de confiabilidade — execução em 29/09/2026

## Entregas

- Premium: cinco endpoints legados protegidos em produção. Acesso direto anônimo 401, gateway com conta sintética 200 em todos, JSON preservado e no-store. Suspensão/expiração da conta invalidaram o acesso com 401; Core continuou 200. Conta sintética cancelada e código rotacionado após o teste. Não houve alteração em contas de alunos.
- Atualizações: aviso acessível com Atualizar agora/Depois; o novo worker aguarda a ação do aluno. Sem recarga automática durante a atividade. Falta de conexão impede a recarga, com orientação. Cache v70; progresso e rascunhos preservados. O aviso aparece quando uma atualização é detectada, não permanentemente.
- Pedagogia: Real Business conta apenas cenários respondidos corretamente; contador atualizado imediatamente; feedback identifica a intenção esperada em português e oferece nova tentativa. Conteúdo e critérios restantes preservados.
- Acessibilidade: nomes dos botões de cenário anterior/próximo; feedback anunciado por região de status; aviso de atualização operável por teclado e com foco visível; mensagem offline distingue Core de Premium.
- Desempenho: prioridade alta para fotos de capa carregadas imediatamente; demais fotos permanecem lazy. Sete arquivos locais totalizam 1,32 MB; não houve aumento de arquivos de imagem. Teste com downloads das fotos retidos confirmou navegação por teclado antes do carregamento e espaço reservado sem mudança da altura da capa.

## Evidências

- QA estático completo, conteúdo pedagógico, acesso e build aprovados.
- Alinhamento/persistência/Speaking/modal: 320, 360, 375, 390, 412, 430, 768 e 1280 px.
- Produto: 360, 390, 768 e 1280 px; contador errado/certo, nova tentativa, nomes acessíveis, foco de modal, revisão, gravação simulada, permissão negada e isolamento dos cenários.
- Oito trilhas Premium: login e renderização com cópias reais do conteúdo em 390/1280 px, usando gateway simulado no navegador; autorização remota foi testada separadamente em APIs reais.
- Fotografias: quatro resoluções; nove páginas de apresentação com fixtures; conexão lenta simulada retendo as imagens.
- PWA: migração de worker antigo, adiamento, bloqueio offline da atualização, escolha de atualizar, recarga e preservação de progresso/rascunho; sete fotos offline, Core fixture offline e Premium recusado offline.

## Pendência que não pode ser automatizada nesta sessão

Não há aparelhos físicos Android/iPhone disponíveis. Instalação real, audibilidade/qualidade da voz, captura real de microfone, teclado móvel e reabertura do app instalado continuam sem certificação física. As simulações não foram apresentadas como substitutas. Roteiro entregue separadamente. A revisão pedagógica deste ciclo focou na jornada/feedback e regressões do conteúdo já auditado, não constitui nova revisão humana integral de todas as lições. Não foi feita auditoria completa WCAG ou medição Lighthouse.
