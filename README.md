# CV — Antônio Carlos Cardoso

Currículo / portfólio web com estética de terminal, painel administrativo para
edição do conteúdo sem mexer no código e armazenamento dos dados na nuvem.

🔗 **Páginas**
- `index.html` — CV público
- `admin.html` — painel de edição (protegido por senha)

---

## ✨ Funcionalidades

- 🖥️ **Design "terminal/hacker"** responsivo (desktop e mobile)
- 🌙 **Tema claro/escuro** com cores personalizáveis
- 🌐 **Bilíngue (PT/EN)** via i18n configurável
- ✏️ **Painel admin** para editar perfil, experiências, projetos, skills,
  formação, certificações, stack, idiomas e seções
- 🖼️ **Upload de imagens** dos projetos (Cloudinary) com galeria/lightbox
- 🔀 **Reordenação por drag-and-drop** dos itens
- 💾 **Backups automáticos** (até 10) e restauração
- 👁️ **Preview** das alterações antes de salvar
- 📄 **Exportação para PDF/impressão** otimizada (ATS) + **QR Code**
- 📊 **Contador de visitas**
- ☁️ **Dados na nuvem** (JSONBin) — edição reflete no CV ao salvar

---

## 🛠️ Stack

- **Front-end:** HTML, CSS e JavaScript puro (ES Modules), sem build
- **Serverless Functions:** Netlify Functions **ou** Vercel Serverless Functions
- **Armazenamento de dados:** [JSONBin.io](https://jsonbin.io)
- **Armazenamento de imagens:** [Cloudinary](https://cloudinary.com)

A arquitetura segue o padrão **MVC**:

```
js/
├── model/        → dados (defaults.js) e estado (state.js)
├── view/         → renderização (index-view.js, admin-view.js)
├── controller/   → lógica + comunicação com as APIs
└── utils.js      → utilitários compartilhados
```

---

## 📁 Estrutura do projeto

```
.
├── index.html                  # CV público
├── admin.html                  # Painel de administração
├── favicon.svg
├── netlify.toml                # Config de deploy (Netlify)
├── vercel.json                 # Config de deploy (Vercel)
│
├── css/
│   ├── variables.css           # Variáveis de tema/cores
│   ├── base.css                # Reset e base
│   ├── index.css               # Estilos do CV público
│   ├── admin.css               # Estilos do painel admin
│   └── print.css               # Estilos de impressão/PDF
│
├── js/
│   ├── utils.js
│   ├── model/
│   │   ├── defaults.js         # Conteúdo padrão do CV
│   │   └── state.js            # Estado + merge com a nuvem
│   ├── view/
│   │   ├── index-view.js
│   │   └── admin-view.js
│   └── controller/
│       ├── api.js              # Chamadas às serverless functions
│       ├── index-controller.js
│       └── admin-controller.js
│
├── api/                        # Serverless Functions (Vercel)
│   ├── cv-read.js              # Lê os dados do JSONBin
│   ├── cv-write.js             # Valida senha e grava no JSONBin
│   ├── cv-upload.js            # Upload de imagem para o Cloudinary
│   └── cv-ping.js              # Diagnóstico + contador de visitas
│
└── netlify/
    └── functions/             # Serverless Functions (Netlify)
        ├── cv-read.js
        ├── cv-write.js
        ├── cv-upload.js
        ├── cv-ping.js
        └── lib/http.js        # Helper HTTP/CORS compartilhado
```

> As funções em `api/` (Vercel) e `netlify/functions/` (Netlify) fazem a mesma
> coisa — você usa o conjunto referente ao host onde for publicar.

---

## 🔑 Variáveis de ambiente

Configure no painel do seu host (Vercel/Netlify):

| Variável                 | Obrigatória | Descrição                                                      |
| ------------------------ | :---------: | -------------------------------------------------------------- |
| `JSONBIN_BIN_ID`         |     ✅      | ID do bin onde os dados ficam salvos                           |
| `JSONBIN_MASTER_KEY`     |     ✅      | **Master Key** do JSONBin (não a Access Key — ela é só leitura) |
| `CV_ADMIN_PASSWORD`      |     ✅      | Senha de acesso ao painel `admin.html`                         |
| `CLOUDINARY_CLOUD_NAME`  |   imagens   | Nome do cloud no Cloudinary                                    |
| `CLOUDINARY_API_KEY`     |   imagens   | API Key do Cloudinary                                          |
| `CLOUDINARY_API_SECRET`  |   imagens   | API Secret do Cloudinary                                       |

> 💡 Acesse `/.netlify/functions/cv-ping` (ou `/api/cv-ping`) no navegador para
> um **diagnóstico** que mostra quais variáveis estão configuradas.

---

## 🚀 Deploy

### Vercel
1. Importe o repositório na Vercel.
2. Configure as variáveis de ambiente acima.
3. Deploy. O `vercel.json` já redireciona as rotas `/.netlify/functions/*`
   para `/api/*`.

### Netlify
1. Importe o repositório na Netlify.
2. Configure as variáveis de ambiente acima.
3. Deploy. O `netlify.toml` já define a pasta de funções e os headers de CORS.

---

## 🧑‍💻 Rodando localmente

Por usar **ES Modules**, abra o projeto com um servidor estático (não direto
pelo `file://`):

```bash
# Opção 1 — Python
python3 -m http.server 8000

# Opção 2 — Node
npx serve .
```

Acesse `http://localhost:8000`.

> Sem as serverless functions rodando localmente, o site cai automaticamente
> para o conteúdo de `js/model/defaults.js`. Para testar a integração completa
> (JSONBin/Cloudinary), use `netlify dev` ou `vercel dev`.

---

## ✏️ Usando o painel admin

1. Acesse `admin.html` e entre com a `CV_ADMIN_PASSWORD`.
2. Edite o conteúdo pelas abas.
3. Clique em **💾 Salvar** — as alterações vão para o JSONBin e aparecem no CV.

---

## 🩺 Solução de problemas

**Erro 403 (Forbidden) ao salvar**
A senha do admin está correta (senão seria 401). O 403 vem do **JSONBin** e
significa: `JSONBIN_MASTER_KEY` inválida **ou** o bin pertence a outra conta.
- Confirme que está usando a **Master Key** (em jsonbin.io → *API Keys*), não a Access Key.
- Confirme que o `JSONBIN_BIN_ID` é de um bin **dessa mesma conta**.
- Atualize a variável no host e faça um novo deploy.

**Acentos/caracteres aparecem corrompidos**
As respostas das funções e as gravações no JSONBin enviam `charset=utf-8`. Se
ainda houver texto antigo corrompido salvo na nuvem, basta **reeditar e salvar**
pelo painel para regravar o conteúdo já corrigido.

**Imagens não sobem**
Verifique as três variáveis `CLOUDINARY_*`. Cada imagem deve ter no máximo 5 MB.
