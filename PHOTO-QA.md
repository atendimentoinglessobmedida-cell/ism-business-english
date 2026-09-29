# QA — fotografias reais gratuitas

29/09/2026. Quatro fotografias Pexels importadas como AVIF local (845431 bytes no total), com créditos e fontes. Aplicadas à Home, cenas contextuais de lições, Business Mode e sete miniaturas Premium. Textos, rotas, acesso e dados pedagógicos preservados. Imagens originais do professor preservadas.

- QA estático completo e build: aprovados, incluindo presença/assinatura AVIF, limite de 300 KB por foto e 900 KB no conjunto, referências locais, pacote Premium e inventário offline.
- Navegador Edge automatizado: Home/figura de lição em 320, 390, 768 e 1280 px; quatro ações, proporção 16:9, rótulos abaixo das imagens, decodificação, foco/Enter, movimento reduzido e ausência de overflow/erros JavaScript. A lição usa fixture para testar a escolha contextual.
- Catálogo Premium em 390/1280 px: sete imagens decodificadas, migração e rascunho após edição/reload, registros originais preservados. Autorização é simulada neste teste.
- PWA: atualização remove cache antigo e preserva progresso/rascunhos; quatro fotos disponíveis offline; Core fixture offline, Premium bloqueado offline; instalação manual e eventos nativos simulados.
- Inspeção visual das capturas mobile/desktop e miniatura Premium: fotos visíveis e rostos preservados. Corrigida sincronização do teste para aguardar decode; a checagem Premium agora ocorre após o carregamento do catálogo e exige sete imagens.

Cache de shell atualizado de v67 para v68 porque os arquivos offline mudaram. Não houve alteração no cache de API nem liberação de conteúdo Premium offline. Créditos estão em photo-credits.html; fotos são servidas pelo próprio app, sem chamadas ao banco de imagens durante o uso.

Limites: não certifica instalação/dispositivo físico Android/iOS ou navegadores antigos sem AVIF. Testes locais executados em Node 24 e Edge; CI usa a versão configurada no projeto. Não houve merge/publicação em produção; permanecem as condições de QA de dispositivos e liberação coordenada de acesso dos PRs anteriores.
