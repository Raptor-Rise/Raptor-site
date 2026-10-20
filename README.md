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
│   ├── config.js               # contato e autorização de logos
│   └── projects.js             # lista de projetos usada em "Outros projetos"
├── projects/                   # capturas de tela e logos originais
└── Caddyfile
```

Cada case fica em uma pasta com `index.html`, acessível por `/projetos/<slug>/`.
O `file_server` do Caddy entrega o `index.html` da pasta automaticamente.

## Configurar contato

Edite `assets/config.js` e preencha:

- `whatsapp.number`: número comercial com DDI e DDD, apenas dígitos (ex.: `5511999999999`);
- `email`: e-mail comercial;
- `social.linkedin`, `social.instagram`, `social.github`: URLs completas dos perfis.

Enquanto o WhatsApp não for configurado, os CTAs exibem um aviso na home e, nas páginas de projeto, direcionam para a seção de contato da home. E-mail e redes sociais só aparecem quando preenchidos.

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
