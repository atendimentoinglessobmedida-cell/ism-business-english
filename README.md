# ISM Business English

Aplicativo estático/PWA de inglês profissional. Esta branch publica HTML, CSS e JavaScript; não requer um build Next.js.

## Desenvolvimento e verificação

- `npm run dev`: servidor local em http://127.0.0.1:4173 (PORT altera a porta).
- `npm run build`: gera `dist/`, verifica manifesto, referências e shell offline.
- `npm start`: serve o artefato `dist/` após o build.
- `npm test`: sintaxe, contratos funcionais, progresso, pedagogia, sessão de acesso e build; sem instalar dependências para os comandos Node equivalentes.
- `npm run qa:browser`: regressão responsiva e persistência.
- `npm run qa:product`: métricas, reforço direcionado, modal acessível e Speaking contextual/manual.

Os testes de navegador exigem Playwright fornecido pelo ambiente. `ISM_PLAYWRIGHT_MODULE` pode indicar seu caminho; `ISM_BROWSER_CHANNEL` pode selecionar um navegador instalado, como `msedge`. O teste de gravação usa simulação de MediaRecorder e permissão negada, sem certificar áudio real de aparelhos físicos.

As dependências históricas permanecem no manifesto para uma futura revisão separada. Os comandos estáticos usam apenas Node.js. A Vercel utiliza `vercel.json` e não instala essas dependências.

## Premium e publicação

O gateway Supabase entrega os scripts de conteúdo após login por email e código. O build exclui esses arquivos e toda a pasta de backend do artefato público. Após alterar conteúdo, execute `node scripts/package-premium.mjs` e implante o gateway atualizado antes de publicar o cliente. Veja `PREMIUM-ACCESS-ROLLOUT.md` para a sequência de ativação e a limitação temporária das APIs antigas.

- `node scripts/premium-progress-browser-check.cjs`: migração e rascunhos em navegador (gateway simulado).
- `node scripts/access-browser-check.cjs`: login, recusa e artefato protegido (gateway simulado; exige build).
- `npm run qa:pwa`: atualização do service worker, cache e persistência; não substitui instalação em aparelhos reais.

GitHub Pages e Vercel publicam somente `dist`. A certificação física em `DEVICE-MEDIA-CERTIFICATION.md` continua necessária para promover a versão candidata.
# Distribuição para alunos

Use a versão atual em https://ism-business-english.vercel.app/ e a instalação em https://ism-business-english.vercel.app/install.html. O GitHub Pages pode conter uma versão anterior. Ao trocar de endereço, exporte o progresso local antes e importe no novo endereço. Consulte [STUDENT-READINESS.md](STUDENT-READINESS.md) para validações e limitações.
