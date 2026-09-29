# ISM Business English

Aplicativo estático/PWA de inglês profissional. Esta branch publica HTML, CSS e JavaScript; não requer um build Next.js.

## Desenvolvimento e verificação

- `npm run dev`: servidor local em http://127.0.0.1:4173 (PORT altera a porta).
- `npm run build`: gera `dist/`, verifica manifesto, referências e shell offline.
- `npm start`: serve o artefato `dist/` após o build.
- `npm test`: sintaxe, dez suites existentes e build; sem instalar dependências para os comandos Node equivalentes.
- `npm run qa:browser`: regressão responsiva e persistência.
- `npm run qa:product`: métricas, reforço direcionado, modal acessível e Speaking contextual/manual.

Os testes de navegador exigem Playwright fornecido pelo ambiente. `ISM_PLAYWRIGHT_MODULE` pode indicar seu caminho; `ISM_BROWSER_CHANNEL` pode selecionar um navegador instalado, como `msedge`. O teste de gravação usa simulação de MediaRecorder e permissão negada, sem certificar áudio real de aparelhos físicos.

As dependências históricas permanecem no manifesto para uma futura revisão separada. Os comandos estáticos usam apenas Node.js. A Vercel utiliza `vercel.json` e não instala essas dependências.
