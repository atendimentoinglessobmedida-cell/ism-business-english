# Ambientes — business

Prévia, staging e produção são separados. A camada visual não cria nem copia segredos. As configurações existentes permanecem intactas. Configure somente os valores do ambiente escolhido, com privilégios mínimos.

Nomes confirmados no inventário de código (nenhum valor):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

As variáveis listadas se aplicam ao backend Supabase; a chave de serviço nunca deve chegar ao navegador. O frontend estático conserva sua configuração pública existente.

O arquivo .env.example é documental; não foi criado .env com valores reais. SMTP, pagamento e acesso hospedado não foram alterados por esta fase.

