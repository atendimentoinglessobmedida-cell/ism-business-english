# ISM Comercial — Pix manual (plano técnico)

Estado: especificação em branch de trabalho; nenhuma cobrança, licença ou acesso foi ativado.

## Restrições
- Preservar GitHub e os quatro aplicativos existentes.
- Nenhuma mensalidade adicional; validar licença comercial da hospedagem (Vercel Hobby não pode ser usada comercialmente).
- Pix para conta do proprietário, confirmação exclusivamente após conferência no extrato; nunca confiar em comprovante enviado pelo comprador.
- Não publicar chave Pix, preços ou dados bancários sem autorização.
- Não coletar dados pessoais de menores sem fluxos apropriados de responsável e privacidade.

## Etapas de engenharia
1. Inventariar stacks, rotas, login, persistência e deploy dos quatro projetos.
2. Criar tela Planos e acesso com demonstração gratuita e CTA Solicitar acesso, inicialmente sem captura de dados em produção.
3. Escolher persistência gratuita com termos de uso comercial compatíveis e autenticação administrativa robusta.
4. Criar tabelas `customers`, `access_requests`, `manual_payments`, `licenses`, `audit_events`; acesso restrito por aplicativo e titular.
5. Implementar fluxo de aprovação manual: solicitação -> instrução Pix privada -> verificação no banco -> registro do pagamento -> ativação da licença -> aviso ao aluno.
6. Validar licença no servidor para conteúdo premium, expiração e revogação; preservar progresso do aluno.
7. Testar autenticação, autorização, repetição de aprovação, vencimento, revogação, UX mobile e regressões.
8. Publicar apenas em staging até aprovação explícita do proprietário e verificação da hospedagem comercial.

## Critérios de aceite
- Sem cobrança real automatizada e sem integração paga.
- Logs de auditoria para ativação/revogação.
- Testes reproduzíveis e rollback documentado.
- Sem mudanças na branch principal até revisão.
