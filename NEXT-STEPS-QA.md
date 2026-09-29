# Execução das próximas etapas — 29/09/2026

## Entrega candidata

Branch: `premium-catalog-access-recovery`, derivada do commit `e83724af88f797dbe91722d9e9b296cedce78ca6` do PR #7. O PR #7 permanece aberto, Draft e sem merge. As alterações estruturais foram separadas da recuperação de alinhamento.

## Alterações

- Catálogo: separadas as trilhas originais (88 lições/8 trilhas) da prática aplicada (57/7). As duas coleções têm atividades e critérios diferentes; não foram somadas artificialmente.
- Progresso: novo namespace para prática aplicada; migração idempotente copia apenas seus registros e preserva os dados originais, incluindo rascunhos. Dados perdidos em versões anteriores dependem de backup existente.
- Premium: gateway com login por email e código, sessão assinada limitada pela validade, verificação de suspensão/vencimento a cada recurso e respostas sem cache. Conteúdo autoral carregado por esse serviço, na ordem original dos scripts.
- Publicação: Vercel e GitHub Pages usam apenas o artefato `dist`; cinco arquivos de conteúdo e todo backend ficam fora dele. Build detecta pacote de conteúdo desatualizado.
- PWA: cache v66 necessário pela mudança de política. Remove cache misto antigo, mantém Core em cache separado, exige conexão para Premium e preserva progresso local. Corrigido fallback offline de arquivos com parâmetros de versão.
- Instalação: mensagens acessíveis para instalação disponível, concluída e indisponível; tratamento de falha e carregamento tardio do instalador.
- Pedagogia: inventário e correções detalhados no relatório separado; fontes de conteúdo corrigidas foram implantadas e validadas.

## Verificação

| Camada | Evidência |
|---|---|
| Sintaxe/contratos/build | QA estático aprovado, incluindo migração, autorização e pedagogia |
| Alinhamento | 320, 360, 375, 390, 412, 430, 768 e 1280px; seis painéis, persistência, Speaking e modal |
| Produto | 360, 390, 768 e 1280px; métricas, rotas, revisão, foco, negação de microfone e isolamento de contextos |
| Progresso Premium | 390/1280px; migração, edição, reload e preservação integral da fonte; gateway simulado |
| Login/artefato | 390/1280px; recusa, sessão, carregamento, retorno ao login e URLs privadas ausentes; gateway simulado |
| Gateway real | login200, conteúdo200, anônimo401, suspensão401, vencimento401; conta temporária removida |
| Atualização PWA | remove cache antigo, preserva conclusão e rascunho, fallback manual, prompt simulado e shell offline |

Os testes de áudio usam MediaRecorder simulado. Nenhum teste automatizado certifica microfone, reprodução audível ou instalação em aparelhos físicos.

## Condições que ainda impedem concluir tudo

1. Certificação física Android/Chrome e iPhone/Safari, exigida em `DEVICE-MEDIA-CERTIFICATION.md`. Não há aparelhos físicos disponíveis nesta sessão.
2. Publicação do cliente aprovado e posterior fechamento das cinco APIs antigas. Durante a transição, essas APIs ainda entregam conteúdo público; portanto **a proteção Premium global ainda não está completa**.
3. Conteúdo previamente publicado em repositório público pode ter sido copiado; o vencimento limita futuras consultas protegidas, não apaga cópias históricas.

Não foi feito merge nem promoção do frontend para produção. O link público de instalação continua apontando para a versão anterior enquanto o candidato é validado.

## Consolidação final

Revisão editorial concluída para 256 registros, incluindo 57 roteiros locais de escuta. Gateway final v3; Core v9; conteúdo Premium v3; entrevistas v2. O fechamento das APIs antigas está implementado em cinco candidatos separados com snapshots/manifesto para reversão e testes aprovados, mas não foi ativado.

As oito páginas Premium passaram em 390/1280px com conteúdo de snapshots reais e gateway simulado. Revisão do login corrigiu contraste, limitou a reautenticação e preserva a sessão válida diante de erro transitório do serviço. Novas consultas Premium permanecem bloqueadas offline; conteúdo previamente recebido não pode ser revogado retroativamente.

