# Padrão ISM de aulas interativas — especificação de implementação

Referência pedagógica: Negotiation Masterclass / ISM Connectors Lab. Aplicar gradualmente a **todas as aulas existentes** sem substituir textos, apagar progresso, mudar permissões ou publicar antes do QA.

## Sequência de cada aula
1. Objetivo profissional e duração estimada.
2. Vocabulário em flashcards bilíngues com áudio, "Já sei" e "Revisar depois".
3. Frases em contexto, áudio en-US, copiar, favorito e alternância EN/PT/ambos.
4. Exercícios curtos: múltipla escolha, lacunas, ordenar palavras e reformulação diplomática.
5. Diálogo guiado com prática de papéis e áudio.
6. Role play com escolhas, feedback e desfecho condicional.
7. Resumo de bolso, revisão e conclusão da etapa.

## Regra obrigatória: alternativas corretas não previsíveis
- Armazenar `correctOptionId` estável, nunca `correctIndex: 0` como regra.
- Em cada tentativa, embaralhar as opções com Fisher–Yates, persistindo a ordem da tentativa até o aluno responder.
- Para sequências de 15 questões, distribuir posições corretas de forma aproximadamente uniforme (3 opções: 5/5/5; 4 opções: 4/4/4/3), com variação entre tentativas.
- Não alterar as respostas ao embaralhar: corrigir por ID, não por índice de tela.
- Evitar alternativas absurdas ou duplicadas; manter comprimento e plausibilidade semelhantes.
- Ao repetir a questão, variar a posição da resposta sem mudar o gabarito.
- Para acessibilidade, não reorganizar alternativas depois que a questão estiver visível.
- Feedback deve explicar por que a resposta está correta e, quando apropriado, por que a escolha feita não serve.

## Contrato de dados recomendado
```ts
type Option = { id: string; text: string };
type Exercise = {
  id: string;
  type: "multiple-choice" | "fill-gap" | "word-order" | "diplomacy";
  prompt: string;
  options?: Option[];
  correctOptionId?: string;
  explanation: string;
  source: "lesson" | "complementary";
};
```

## Persistência e progressão
- Usar IDs estáveis por curso/módulo/aula/exercício; versionar o esquema de progresso.
- Preservar os registros existentes de conclusão, favoritos, estrelas e tentativas.
- Suportar retomada e sincronização existentes, sem substituí-las por localStorage quando houver conta.
- Não marcar aula concluída somente por abrir a página; exigir etapas obrigatórias finalizadas.

## QA e critérios de aceite
- Inventariar todas as aulas antes de migrar e criar adaptadores para conteúdos antigos.
- Testar distribuição das respostas corretas em no mínimo 100 gerações, com 3 e 4 alternativas.
- Testar reentrada, persistência, acessibilidade por teclado, mobile e áudio.
- Verificar que alternativas nunca ficam duplicadas ou com gabarito inválido.
- Testar aulas existentes e fluxo de login/pagamento antes do merge.
- Rodar `npm run typecheck`, `npm run exercise:qa`, `npm run functional:qa` e `npm run build` quando o código completo estiver disponível.
- Publicar somente após validação do conjunto e aprovação.
