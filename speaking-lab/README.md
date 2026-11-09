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
