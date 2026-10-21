/* Original contextual grammar practice. Existing course completion stays unchanged. */
(()=>{'use strict';
 const data={
 'meeting-decisions':[
 ['Complete: Could you ___ the main blocker?','clarify',['clarifies','clarify','clarifying'],'Depois de could, use o verbo na forma base, sem to.'],
 ['Choose the correct commitment.','Alex will send the minutes tomorrow.',['Alex will sends the minutes tomorrow.','Alex will sending the minutes tomorrow.','Alex will send the minutes tomorrow.'],'Will é seguido pela forma base: will send.'],
 ['Complete: Who is responsible ___ this action?','for',['for','to','at'],'A combinação é responsible for + tarefa ou responsabilidade.'],
 ['Correct the question: Does the team needs approval?','Does the team need approval?',['Does the team need approval?','Do the team needs approval?','Does the team needing approval?'],'Does já marca a terceira pessoa; o verbo principal fica na forma base.']
 ],
 'deadline-negotiation':[
 ['Complete: Could we ___ the deadline?','extend',['extended','extending','extend'],'Depois de could we, use a forma base do verbo.'],
 ['Complete: We can commit ___ Friday.','to',['at','to','for'],'Commit to introduz o compromisso, incluindo a data acordada.'],
 ['Choose the correct conditional.','If we reduce the scope, we will finish on time.',['If we will reduce the scope, we finish on time.','If we reduce the scope, we will finish on time.','If we reduces the scope, we will finish on time.'],'Para uma condição futura possível, use if + presente e will + verbo na consequência.'],
 ['Complete: This option is ___ than the original plan.','more realistic',['most realistic','realistic','more realistic'],'A comparação entre opções usa more realistic than.']
 ],
 'presenting-results':[
 ['Complete: Revenue ___ by 8% last quarter.','increased',['increases','increased','has increase'],'Last quarter é um período encerrado; use o passado simples.'],
 ['Complete: Demand may ___ next month.','rise',['rise','rises','rose'],'May indica possibilidade e exige a forma base do verbo.'],
 ['Choose the correct comparison.','Costs were lower than expected.',['Costs were lowest than expected.','Costs were more lower than expected.','Costs were lower than expected.'],'Lower já é comparativo; não acrescente more.'],
 ['Complete: There ___ three main findings in the report.','are',['is','are','be'],'Three findings é plural; use there are.']
 ],
 'email-request':[
 ['Complete: Could you please ___ the attachment?','check',['checking','checked','check'],'Could you please é seguido pela forma base.'],
 ['Complete: Please send your reply ___ Friday at the latest.','by',['until','by','during'],'By marca o prazo máximo para concluir uma ação.'],
 ['Complete: I will be in the office ___ five, then I will leave.','until',['by','on','until'],'Until descreve uma situação que continua até um horário.'],
 ['Choose the correct indirect question.','Could you confirm when the meeting starts?',['Could you confirm when does the meeting start?','Could you confirm when the meeting starts?','Could you confirm when starts the meeting?'],'Na pergunta indireta, use a ordem de afirmação: the meeting starts.']
 ],
 'customer-recovery':[
 ['Complete: The package ___ late yesterday.','arrived',['arrives','arrived','arriving'],'Yesterday indica passado encerrado. Arrive é regular: arrived.'],
 ['Complete: I will ___ the delivery status.','check',['check','checks','checked'],'Depois de will, use a forma base do verbo.'],
 ['Complete: We are sorry ___ the inconvenience.','for',['at','of','for'],'Use sorry for para reconhecer o transtorno causado.'],
 ['Choose the correct present perfect sentence.','We have received your complaint.',['We have receive your complaint.','We has received your complaint.','We have received your complaint.'],'Com we, use have + particípio: have received.']
 ],
 'interview-evidence':[
 ['Complete: Last year, I ___ a team of six.','led',['lead','led','have lead'],'O passado de lead é led; last year indica período encerrado.'],
 ['Choose the correct experience statement.','I have worked in sales for five years.',['I have worked in sales for five years.','I have work in sales since five years.','I has worked in sales for five years.'],'Have worked + for descreve uma duração que continua até o presente.'],
 ['Complete: I have worked here ___ 2022.','since',['for','since','during'],'Since introduz o ponto de início; for introduz uma duração.'],
 ['Correct: She managed successfully the project.','She managed the project successfully.',['She managed the project successfully.','She successfully the project managed.','She managed the successfully project.'],'Em ordem neutra, mantenha verbo e objeto juntos e coloque successfully depois do objeto.']
 ],
 'workplace-introductions':[
 ['Complete: I ___ the new operations analyst.','am',['is','am','are'],'Com I, a forma de be no presente é am.'],
 ['Complete: She ___ in Finance.','works',['work','working','works'],'No presente simples afirmativo, she exige works.'],
 ['Complete: I work ___ a logistics company.','for',['for','on','at the for'],'Work for identifica o empregador.'],
 ['Choose the correct question.','What do you do?',['What does you do?','What do you do?','What you do?'],'Com you, use do + sujeito + verbo para perguntar sobre a ocupação.']
 ],
 'scheduling-a-meeting':[
 ['Complete: Are you available ___ Monday?','on',['at','on','in'],'Use on com dias da semana.'],
 ['Complete: The call starts ___ 10 a.m.','at',['in','on','at'],'Use at antes de um horário específico, como at 10 a.m.'],
 ['Choose the correct availability question.','Are you available tomorrow?',['Do you available tomorrow?','Are you available tomorrow?','Is you available tomorrow?'],'Available é adjetivo; a pergunta usa be, não do.'],
 ['Complete: We ___ meeting the client tomorrow; the time is confirmed.','are',['are','do','will to'],'O presente contínuo pode indicar um compromisso futuro já combinado.']
 ],
 'taking-a-phone-message':[
 ['Complete: Could you ___ your surname?','spell',['spells','spell','spelling'],'Could you exige verbo na forma base.'],
 ['Choose the correct offer to take a phone message.','May I take a message?',['May I to take a message?','May I takes a message?','May I take a message?'],'May é modal e vem antes da forma base, sem to.'],
 ['Complete: She ___ available right now.','is not',['does not','is not','do not'],'Available é adjetivo; a negativa usa is not.'],
 ['Choose the correct possessive.','Could I have your phone number?',['Could I have you phone number?','Could I have yours phone number?','Could I have your phone number?'],'Your vem antes de um substantivo. Yours substitui o grupo nominal.']
 ],
 'clarify-and-confirm':[
 ['Complete: Which file does that ___ to?','refer',['refers','referred','refer'],'Depois de does, use a forma base: refer.'],
 ['Choose the correct confirmation.','You need one page, not the full report.',['You needs one page, not the full report.','You need one page, not the full report.','You needing one page, not the full report.'],'Com you, use need no presente simples afirmativo.'],
 ['Complete: Please ___ the total for June.','include',['include','includes','included'],'Uma instrução afirmativa usa o verbo na forma base, sem sujeito explícito.'],
 ['Complete: Let me ___ my understanding.','check',['to check','checking','check'],'A estrutura é let + objeto + verbo sem to: let me check.']
 ],
 'concise-project-update':[
 ['Complete: The average ___ from five to three hours last week.','fell',['fallen','falls','fell'],'O passado de fall é fell; fallen é o particípio.'],
 ['Complete: Another team might ___ different results.','get',['gets','get','got'],'Might expressa possibilidade e é seguido pela forma base.'],
 ['Choose the correct quantity expression.','We tested fewer cases this week.',['We tested less cases this week.','We tested fewer cases this week.','We tested much cases this week.'],'Cases é contável plural; fewer é a escolha padrão para comparação de quantidade.'],
 ['Complete: The sample is too small ___ a firm conclusion.','to support',['supporting','support','to support'],'Too + adjetivo + to + verbo expressa um limite que impede um resultado.']
 ],
 'handover-across-teams':[
 ['Complete: If approval ___ pending, contact Lee.','is',['will be','is','be'],'Na condição com if sobre uma possibilidade futura, use presente simples.'],
 ['Choose the correct future action.','I will send the update on Thursday.',['I will to send the update on Thursday.','I will sends the update on Thursday.','I will send the update on Thursday.'],'Will é seguido pelo verbo sem to e sem s.'],
 ['Complete: The documents were ___ yesterday.','sent',['send','sent','sending'],'A passiva usa be + particípio; o particípio de send é sent.'],
 ['Complete: Please check the file before ___ it to the next team.','sending',['send','to send','sending'],'Depois da preposição before, use a forma em -ing.']
 ]};
 window.ISMBusinessGrammar=data;
})();
