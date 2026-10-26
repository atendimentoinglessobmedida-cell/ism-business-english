# Premium: 50 novas lições — P3 a P8

Desenvolvimento de conteúdo e frontend. P1 (30 lições) e P2 (8 lições) preservados. Total do catálogo: 88 lições Premium.

## Estrutura pedagógica

Cada nova lição contém situação profissional, duas expressões bilíngues, dois itens de vocabulário, escolha contextual com três alternativas e explicação, exercício de completar expressão, produção escrita com modelo e dois critérios específicos, e prática oral com autoavaliação. A última lição de cada trilha é um desafio de integração.

São 100 entradas de vocabulário (incluem retomadas entre lições), 100 expressões bilíngues, 100 exercícios objetivos, 50 tarefas escritas e 50 práticas orais. O nível intermediário e o tempo de 15–20 minutos são sugestões, não resultados de validação com alunos.

## P3 · Networking — 7 lições

Iniciar, desenvolver e manter conversas profissionais com interesse e respeito.

1. **Starting a conversation** — Iniciando uma conversa.
2. **Your professional introduction** — Sua apresentação profissional.
3. **Asking follow-up questions** — Fazendo perguntas de continuidade.
4. **Finding common ground** — Encontrando interesses em comum.
5. **Exchanging contact details** — Trocando contatos.
6. **Following up after an event** — Retomando contato após um evento.
7. **Networking in practice** — Desafio de networking.

## P4 · Global Teams — 8 lições

Alinhar trabalho, esclarecer mensagens e colaborar entre equipes distribuídas.

1. **Clarifying roles** — Esclarecendo responsabilidades.
2. **Working across time zones** — Trabalhando entre fusos.
3. **Writing asynchronous updates** — Enviando atualizações assíncronas.
4. **Checking understanding** — Confirmando entendimento.
5. **Communication preferences** — Preferências de comunicação.
6. **Sharing decisions and handovers** — Registrando decisões e transições.
7. **Including remote colleagues** — Incluindo colegas remotos.
8. **Global team alignment** — Desafio de alinhamento global.

## P5 · Negotiation & Persuasion — 9 lições

Explorar interesses, apresentar propostas e negociar condições com clareza.

1. **Preparing your priorities** — Preparando prioridades.
2. **Exploring interests** — Investigando interesses.
3. **Making a proposal** — Apresentando uma proposta.
4. **Explaining value** — Explicando valor.
5. **Responding to objections** — Respondendo a objeções.
6. **Trading concessions** — Negociando concessões.
7. **Setting negotiation limits** — Estabelecendo limites.
8. **Confirming an agreement** — Confirmando um acordo.
9. **Negotiation challenge** — Desafio de negociação.

## P6 · Difficult Conversations — 8 lições

Tratar problemas de trabalho com fatos, escuta, limites e próximos passos.

1. **Opening a sensitive conversation** — Abrindo uma conversa sensível.
2. **Separating facts and judgments** — Separando fatos e julgamentos.
3. **Explaining impact** — Explicando impacto.
4. **Listening to the other side** — Ouvindo o outro lado.
5. **Disagreeing without escalation** — Discordando sem agravar a tensão.
6. **Setting boundaries respectfully** — Estabelecendo limites com respeito.
7. **Agreeing on an improvement plan** — Combinando um plano de melhoria.
8. **Difficult conversation challenge** — Desafio de conversa difícil.

## P7 · Leadership — 9 lições

Comunicar direção, delegar, apoiar decisões e acompanhar a equipe.

1. **Communicating direction** — Comunicando direção.
2. **Delegating clearly** — Delegando com clareza.
3. **Setting expectations** — Alinhando expectativas.
4. **Coaching with questions** — Apoiando o desenvolvimento com perguntas.
5. **Recognizing contributions** — Reconhecendo contribuições.
6. **Giving developmental feedback** — Dando feedback para desenvolvimento.
7. **Explaining decisions** — Explicando decisões.
8. **Leading through change** — Liderando durante mudanças.
9. **Leadership briefing** — Desafio de comunicação de liderança.

## P8 · Career Growth — 9 lições

Descrever resultados, pedir feedback e construir um plano de desenvolvimento profissional.

1. **Reflecting on achievements** — Refletindo sobre resultados.
2. **Describing strengths with evidence** — Descrevendo pontos fortes com evidências.
3. **Asking for useful feedback** — Pedindo feedback útil.
4. **Discussing development areas** — Conversando sobre pontos de desenvolvimento.
5. **Setting development goals** — Definindo objetivos de desenvolvimento.
6. **Seeking mentoring** — Buscando mentoria.
7. **Discussing new responsibilities** — Conversando sobre novas responsabilidades.
8. **Updating your career story** — Atualizando sua narrativa profissional.
9. **Your development conversation** — Desafio de desenvolvimento profissional.

## Funcionamento

- Acesso pelos cards P3–P8 da tela Premium e por premium.html. Endereços próprios por lição, botões anterior/próxima e histórico do navegador.
- Salvamento de rascunhos e progresso por trilha nas chaves ismbe:premium:p3:v1 até ismbe:premium:p8:v1. Não há gravação nas chaves Core, P1 ou P2.
- Conclusão exige ambos os exercícios conferidos, tentativa escrita, abertura do modelo, critérios marcados e prática oral declarada. Edição do texto pede nova autoavaliação, preservando conclusões anteriores.
- Áudio de frases e modelos com voz do dispositivo e velocidades normal/lenta. Não há gravação, arquivos de áudio próprios nem avaliação automática de pronúncia.
- Conteúdo novo distribuído como arquivos estáticos; a leitura das novas lições não depende de uma chamada ao backend. Isso não implica instalação offline ou sincronização entre dispositivos.

## Verificação

- Teste automatizado em .ci/premium-check.cjs: 50 estruturas, títulos únicos, alternativas, respostas, variantes aceitas, rotas, critérios de conclusão, contagens, chaves independentes, sintaxe e recursos locais.
- Navegador local: primeira lição P3 completa, erro seguido de acerto, rascunho após recarregar, conclusão, próxima lição, Voltar e progresso 1/7; edição invalida autoavaliação sem remover conclusão anterior.
- Seis catálogos e seis desafios finais abertos; sem transbordamento horizontal observado a 320px. Capturas da lição a 390px e catálogo a 1366px. Nenhum erro de console retornado nas novas trilhas durante a verificação.
- Integração local: retorno à tela Premium e abertura pelo card P3.

## Limites

Conteúdo ainda não testado com alunos. Produção escrita e oral usa autoavaliação, sem certificação de proficiência. Alguns distratores são introdutórios: ampliar desafios de ambiguidade é uma evolução futura. Áudio em Android físico e todas as combinações de aparelhos não foram testados. Preços, condições de assinatura e controle de acesso pago não foram alterados; esta é a experiência de avaliação do app.
