# Raptor — landing page provisória

Site estático (HTML, CSS e JavaScript), sem build e sem dependências externas.

## Rodar localmente

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

Ou, com Caddy instalado:

```bash
caddy run --config Caddyfile
```

## Estrutura

```text
/
├── index.html                  # home (inclui a seção Projetos em destaque)
├── projetos/
│   ├── acervo-digital/index.html
│   ├── central-de-midias/index.html
│   └── realfor-tax/index.html
├── assets/
│   ├── styles.css              # estilos compartilhados (site + cases)
│   ├── main.js                 # menu, contato, galeria ampliada, navegação
│   ├── analytics.js            # consentimento, GA4 e eventos de conversão
│   ├── config.js               # contato e autorização de logos
│   └── projects.js             # lista de projetos usada em "Outros projetos"
├── projects/                   # capturas de tela e logos originais
└── Caddyfile
```

Cada case fica em uma pasta com `index.html`, acessível por `/projetos/<slug>/`.
O `file_server` do Caddy entrega o `index.html` da pasta automaticamente.

## Configurar contato

Edite `assets/config.js` e preencha:

- `whatsapp.url`: link completo de WhatsApp (tem prioridade; ex.: `https://wa.link/l9u1pw`);
- `whatsapp.number`: alternativa ao link, com DDI e DDD, apenas dígitos (ex.: `5521999999999`);
- `whatsapp.message`: texto pré-preenchido, aplicado somente quando o link é gerado a partir do número;
- `email`: e-mail comercial;
- `social.linkedin`, `social.instagram`, `social.github`: URLs completas dos perfis.

Enquanto nenhum dos dois campos de WhatsApp estiver configurado, os CTAs exibem um aviso na home e, nas páginas de projeto, direcionam para a seção de contato da home. E-mail e redes sociais só aparecem quando preenchidos.

## Configurar Google Analytics 4

O site possui integração com GA4 em `assets/analytics.js`, usando consentimento
básico: nenhum script ou dado é enviado ao Google antes de o visitante aceitar os
cookies analíticos.

1. No Google Analytics, crie uma propriedade GA4 e um fluxo de dados da Web.
2. Copie o Measurement ID do fluxo, no formato `G-XXXXXXXXXX`.
3. Preencha `analytics.measurementId` em `assets/config.js`.
4. Publique e valide uma visita consentida nos relatórios Tempo real e DebugView.
5. Em **Administrador → Eventos**, marque `contact_click` como evento principal,
   caso o clique para iniciar contato seja a conversão desejada.

Enquanto `measurementId` estiver vazio ou fora do formato `G-...`, a integração,
o banner e o botão de preferências permanecem inativos. Os eventos implementados são:

- `page_view`: visualização de cada página, emitida pelo próprio GA4;
- `contact_click`: clique em WhatsApp ou e-mail;
- `select_content`: abertura de um projeto;
- `gallery_open`: abertura de uma imagem da galeria.

O registro local `raptor_analytics_consent_v1` guarda somente a escolha entre
aceitar e rejeitar. O visitante pode alterá-la pelo rodapé ou em
`privacidade.html`. Recursos de anúncios, personalização e Google Signals ficam
desativados no código.

## Logos de empresas e parceiros

A faixa de parceiros exibe apenas o nome das empresas em texto por padrão.

Cada logo em `config.js` → `partnerLogos` possui `authorized: false`. A imagem só é
carregada e exibida quando `authorized` for `true`, o que deve ser feito apenas após
autorização formal de cada empresa.

## Adicionar um projeto

1. Crie `projetos/<slug>/index.html` seguindo a estrutura de um dos cases.
2. Adicione o card na seção `#projetos` da home.
3. Inclua a entrada em `assets/projects.js` (usada na navegação "Outros projetos"),
   com `thumb` (miniatura de 320px), `thumbAlt` e a URL da página.
4. Prefira gerar variantes WebP em 800px (`-sm.webp`), largura nativa (`-lg.webp`) e
   uma miniatura de 320px (`-thumb.webp`) para manter as páginas leves.

## Publicar (Caddy)

Copie o projeto para o servidor e aponte o Caddy para a pasta:

```bash
SITE_ADDRESS=raptor.seudominio.com.br \
SITE_ROOT=/var/www/raptor \
caddy run --config Caddyfile
```

O `Caddyfile` já configura compressão, cache dos assets e das capturas, e cabeçalhos
básicos de segurança. Para produção, rode o Caddy como serviço (`caddy run` em
systemd ou container).

## Antes de publicar

- Preencher `assets/config.js` (contato e autorização dos logos).
- Adicionar `og:url` e usar URLs absolutas em `og:image` e `twitter:image`.
- Confirmar a autorização de uso das capturas e dos nomes das empresas citadas.
- Atualizar o favicon/OG image caso a identidade visual mude.
