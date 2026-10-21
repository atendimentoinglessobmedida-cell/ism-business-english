(function(root){
 'use strict';
 const steps=[{label:'Vocabulário',parts:[0],hint:'Conheça as expressões e ouça os exemplos.'},{label:'Diálogo',parts:[3],hint:'Descubra como as expressões funcionam em uma conversa profissional.'},{label:'Ouvir',parts:[4],hint:'Confira o que compreendeu sobre o problema e a decisão.'},{label:'Linguagem',parts:[2],hint:'Observe a estrutura, escolha a expressão e confira a explicação.'},{label:'Praticar',parts:[1,5],hint:'Recupere as expressões nos jogos e responda ao interlocutor na simulação.'},{label:'Aplicar',parts:[6,7],hint:'Produza sua mensagem, pratique em voz alta e revise antes de concluir.'}];
 const sequence=steps.flatMap(step=>step.parts);
 function group(stage){return steps.findIndex(step=>step.parts.includes(stage));}
 function adjacent(stage,direction){const index=sequence.indexOf(stage);return index<0?null:sequence[index+direction]??null;}
 const language={
 'meeting-decisions':['Pedidos com could','Use Could you + verbo para pedir uma informação com cortesia. Para definir uma ação, use responsável + will + verbo + prazo.','Could you clarify the blocker?','Alex will contact the client by Tuesday.'],
 'deadline-negotiation':['Propostas e compromissos','Could we + verbo abre uma proposta. Can commit to + data confirma um compromisso; só use quando a entrega for viável.','Could we reduce the scope?','We can commit to Tuesday.'],
 'presenting-results':['Resultados e previsões','Use o passado para um resultado medido e uma expressão de possibilidade para uma previsão. Não apresente expectativa como certeza.','Sales increased last quarter.','Demand may increase next quarter.'],
 'email-request':['Pedidos e prazos','Could you please + verbo torna o pedido explícito. By indica o limite de entrega; until descreve uma situação que continua até um momento.','Could you please send the figures by Friday?','I will be available until noon.'],
 'customer-recovery':['Reconhecer e agir','Descreva o problema concreto e indique sua próxima ação com will. Evite uma promessa que dependa de aprovação ainda pendente.','I understand that the delivery arrived late.','I will check the status and update you tomorrow.'],
 'interview-evidence':['Experiência com evidências','Para uma experiência concluída, use verbos no passado. Separe o contexto, o que você fez e o resultado que pode sustentar.','I coordinated the handover.','The team completed the task on time.'],
 'workplace-introductions':['Função e equipe','Use I am para nome e função. Use work in para área, work for para empregador e work with para colaboração.','I work in Operations.','I work with the sales team.'],
 'scheduling-a-meeting':['Propor e confirmar horários','Use Can you ou Are you available para conferir disponibilidade. Use on com dias e at com horários; confirme também o fuso em reuniões internacionais.','Are you available on Thursday?','Can we meet at ten?'],
 'taking-a-phone-message':['Pedir repetição e confirmar','Could you + verbo permite pedir repetição ou soletração. Leia os detalhes de volta antes de encaminhar; anotar um recado não é prometer uma resposta.','Could you spell your surname?','Let me read the extension back to you.'],
 'clarify-and-confirm':['Reformular para confirmar','Let me check my understanding introduz sua interpretação. In other words reformula a ideia; confirme detalhes em vez de acrescentar informações não combinadas.','Let me check my understanding: one page by noon.','In other words, you need the total without regional detail.'],
 'concise-project-update':['Dado observado e hipótese','O passado descreve o que foi medido. May ou could apresentam possibilidade. Inclua o tamanho da amostra para limitar a conclusão.','The average fell from five to three hours.','Another team may get a different result.'],
 'handover-across-teams':['Condições para o próximo passo','Use if + presente para a condição e uma instrução ou will + verbo para a ação. Pending significa pendente, não aprovado.','If approval is still pending, contact Lee.','I will send an update on Thursday.']
 };
 root.ISMBusinessLessonModel={steps,sequence,group,adjacent,language};
})(typeof window==='undefined'?globalThis:window);
