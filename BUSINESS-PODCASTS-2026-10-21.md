# ISM Business: miniaulas bilíngues em áudio

Data: 21/10/2026

## Entrega
Três episódios-piloto, cada um com duas versões completas: explicação em português com exemplos em inglês e explicação inteiramente em inglês. São seis MP3 locais, cerca de 52 minutos somados e 24,8 MB. As aulas são de prática Regular e podem ser ouvidas sem gerar voz no navegador do aluno.

| Episódio | Português + inglês | English only |
|---|---|---|
| Expressões em reuniões | 8:49 | 7:37 |
| Orçamento e indicadores | 9:10 | 8:15 |
| Fornecedores e entrega | 9:23 | 8:22 |

Cada episódio tem seis capítulos: contexto, vocabulário, pronúncia, diálogo, prática com pausas e resumo. O player oferece seleção de idioma e episódio, velocidade, repetição de capítulo, transcrição temporizada, download do MP3 e retorno à aula. Trocar o idioma interrompe a versão anterior e conserva o capítulo. As preferências têm chave própria e não alteram respostas, conclusões, licenças ou o progresso do curso.

## Produção de áudio
Roteiros autorais derivados das três aulas originais do app. Síntese local com Microsoft Maria em português brasileiro e Microsoft Zira em inglês americano; não foi contratado serviço externo de geração. Há uma voz inglesa, com variações discretas de tom e velocidade para os dois papéis. O app informa essa limitação e identifica a narração como sintetizada. Não são duas vozes inglesas independentes nem gravações de atores humanos.

O áudio foi montado com pausas de repetição e resposta, convertido para MP3 mono a 64 kbps e normalizado com alvo de -18 LUFS e limite de pico verdadeiro de -2 dB. A pronúncia é um modelo de síntese; não há avaliação automática da fala. Escuta e aprovação pedagógica humana em aparelhos reais continuam recomendadas antes de chamar a produção de gravação profissional.

## Verificação
- Suite estática completa: contratos funcionais, persistência, acesso, conteúdos, formato e testes das miniaulas aprovados.
- Os seis MP3 foram decodificados e conferidos quanto à duração, presença de sinal audível e margem de volume. Hashes e tamanhos conferem com o catálogo.
- Os seis arquivos iniciaram reprodução real no navegador local, sem erro de mídia.
- Busca no capítulo de diálogo conferida a partir de 250,6 segundos em inglês e 290,0 segundos em português. Troca de idioma deixou somente um elemento de áudio e interrompeu o anterior.
- Preferências recuperadas após recarregar. Layout sem rolagem horizontal em 320, 390, 768 e 1280 pixels.
- Resposta HTTP de streaming local conferida: 206, audio/mpeg, 100 bytes para bytes=0-99.
- MP3 não é pré-carregado em massa no service worker; arquivos são solicitados ao ouvir ou baixar. Respostas parciais não são inseridas no cache como se fossem arquivos completos. O cache e a atualização mantêm os arquivos anteriores do curso.
- Áudio nativo iniciado pelo aluno pode continuar em aba de fundo conforme o navegador. Navegar para fora da página interrompe o player. Não foi prometido funcionamento em tela bloqueada em todos os sistemas.

## Como reproduzir a geração
Requisitos de desenvolvimento: Node, PowerShell 7 com Microsoft Zira Desktop, Windows PowerShell com Microsoft Maria/WinRT, Python com NumPy e um FFmpeg confiável. Os scripts de geração não são enviados como páginas públicas.

1. Execute scripts/prepare-podcast-jobs.cjs com uma pasta de build dedicada.
2. Execute scripts/render-podcast-english.ps1 no PowerShell 7, usando jobs.json e a subpasta clips.
3. Execute scripts/render-podcast-clips.ps1 no Windows PowerShell para gerar os trechos em português.
4. Execute scripts/package-podcasts.py com a pasta de build, raiz do projeto e caminho do FFmpeg.
5. Execute scripts/check-podcast-media.py com raiz, FFmpeg e caminho do relatório técnico.
6. Execute node scripts/qa-static.mjs antes de publicar.

A execução de produção consome os seis MP3 já prontos. Não depende desses programas, das vozes do Windows ou de uma chave de API.

## Possibilidade nos outros aplicativos

| Aplicativo | Viabilidade observada | Adaptação necessária |
|---|---|---|
| Easy English | Alta. Há player e rota de áudio com verificação de identidade/período, além do processo de revisão de áudios. | Criar roteiros de inglês geral por nível, reaproveitar o player de episódios e entregar áudio longo protegido por uma rota autorizada com streaming. Não colocar gravações do curso protegido em uma pasta pública; a amostra pode seguir a política existente. |
| Young | Alta. O player já aceita arquivos autorizados da mesma origem e o build publica os recursos da pasta public. | Fazer episódios mais curtos, adequados a adolescentes, com histórias e desafios. Conferir a autorização de qualquer conteúdo restrito antes de distribuir MP3 ou habilitar cache. |
| Travel | Alta. O player de diálogos já aceita áudio da mesma origem e o app separa conteúdos Regular e Premium. | Transformar situações de aeroporto, hotel e restaurante em episódios bilíngues; acrescentar o componente React de capítulos e preservar a validação Premium para gravações restritas. |

Esta entrega publica somente o Business. Nos outros três apps foi feita inspeção de compatibilidade do código local, sem alterar ou publicar versões. A prioridade sugerida é Easy, Travel e Young, com validação do roteiro-piloto de cada público antes de expandir o catálogo.

## Evidências
business-podcast-media-qa-2026-10-21.json, business-podcast-browser-qa-2026-10-21.json e business-podcast-qa-2026-10-21.log na pasta outputs desta conversa.
