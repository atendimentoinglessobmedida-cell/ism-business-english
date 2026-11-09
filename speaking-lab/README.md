# ISM Speaking Lab — piloto Business English

## Estado
Protótipo isolado na branch `feature/ism-speaking-lab-pilot`. **Não integrado à navegação, não publicado e não disponível para alunos.**

## Componentes
- `pilot.tsx`: componente React client-side, com 3 atividades A2/B1.
- Text-to-speech por `speechSynthesis` com idioma `en-US`.
- Reconhecimento via Web Speech API quando disponível; alternativa por digitação.
- Repetição: cobertura de palavras, **não** nota de pronúncia.
- Conversação aberta: sem pontuação automática; apresenta modelo para comparação.
- Nenhum áudio ou transcrição é enviado pelo código do componente ao backend ISM nem persistido em banco ou localStorage.

## Limitações e privacidade
A implementação do reconhecimento de fala varia por navegador e pode enviar áudio a serviços do fornecedor do navegador. Solicitar consentimento antes do uso, especialmente para menores de idade. A síntese de voz depende das vozes instaladas e pode variar. Não prometer correção fonética ou avaliação de fluência a partir da transcrição.

## Próximas verificações antes de integração
1. Identificar a estrutura real de rotas e autenticação do app e inserir o componente numa rota protegida sem quebrar fluxos existentes.
2. Testar em Android Chrome, Edge desktop, iOS Safari e em modo sem permissão de microfone.
3. Validar acessibilidade e UX mobile.
4. Revisar consentimento/LGPD e política de privacidade.
5. Testar build e TypeScript do projeto completo.
6. Submeter PR para revisão e publicar em ambiente de staging somente após aprovação.

## Conteúdo inicial
1. Listen & Repeat: "Good morning, everyone. My name is Alex."
2. Introducing Yourself in a Meeting.
3. What do you do at your company?

## Rota de pré-visualização (branch experimental)
- Rota Next.js: `src/app/speaking-lab/page.tsx`
- URL local após iniciar `npm run dev`: `http://localhost:3000/speaking-lab`
- Proteção: retorna 404 quando `NODE_ENV` não é `development`.
- Ainda **não** vinculada à navegação, nem aos sistemas de acesso normal/Premium.
- Para produção, substituir a proteção de desenvolvimento por autenticação e autorização server-side adequadas, com testes de regressão.
- O componente utiliza APIs de fala apenas no navegador e não deve ser interpretado como análise fonética.

## Testes manuais mínimos
1. Em desenvolvimento, abrir `/speaking-lab`, ouvir o áudio e conceder permissão de microfone.
2. Repetir a primeira frase e conferir a transcrição e a cobertura de palavras.
3. Responder às atividades 2 e 3; confirmar que não há nota automática de pronúncia.
4. Negar microfone e conferir mensagem de erro ou alternativa de digitação.
5. Verificar a navegação entre atividades e o cancelamento de gravações.
6. Em build de produção, conferir que `/speaking-lab` retorna 404.
7. Validar `npm run typecheck` e `npm run build` em ambiente com dependências instaladas.
