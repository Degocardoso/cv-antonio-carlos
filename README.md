# CV — Antônio Carlos Cardoso

Portfólio web em formato de **história**: em vez de listar informações, o CV
conduz o visitante por capítulos conforme ele rola a página, com trilhos
horizontais para a linha do tempo e os projetos. Inclui painel administrativo
para editar o conteúdo sem mexer no código e armazenamento na nuvem.

🔗 **Páginas**
- `index.html` — CV público
- `admin.html` — painel de edição (protegido por senha)

---

## 📖 A narrativa

O conteúdo é reorganizado em capítulos, e não em blocos independentes:

| Capítulo | Seção | Efeito |
| -------- | ----- | ------ |
| Prólogo    | Apresentação, tags, contato | Entrada escalonada + parallax |
| 01 Impacto | Projetos em destaque com métricas e galeria | **Trilho horizontal** |
| 02 Credenciais | Certificações e cursos | Revelação escalonada |
| 03 Origem  | "Sobre mim" + números da carreira | Revelação no scroll + contadores |
| 04 Trajetória | Experiência **e** formação fundidas em uma linha do tempo única, ordenada por ano | **Trilho horizontal** |
| 05 Arsenal | Habilidades, idiomas e stack | Barras animadas + esteira infinita |
| Epílogo    | Objetivo profissional e contato | Encerramento com CTA |

> A ordem é definida pela posição dos `<section>` no `index.html`. A numeração
> e o kicker ("Capítulo dois") são calculados em tempo de execução, pulando
> seções desligadas no admin — para reordenar, basta mover as seções.

---

## ✨ Funcionalidades

- 🎬 **Storytelling em scroll** com capítulos, progresso de leitura e navegação lateral
- ↔️ **Trilhos horizontais** para a linha do tempo e os projetos: arraste com o
  mouse, deslize no touch ou use as setas e os botões — a página nunca prende
- ✦ **Animações de entrada**, parallax sutil e contadores animados nas métricas
- 🖥️ **Estética de terminal** modernizada, responsiva (desktop e mobile)
- 🌙 **Tema claro/escuro** com cores personalizáveis (preferência salva no navegador)
- 🌐 **Bilíngue (PT/EN)** via i18n configurável
- ✏️ **Painel admin** para editar perfil, experiências, projetos, skills,
  formação, certificações, stack, idiomas e seções
- 🖼️ **Upload de imagens** dos projetos (Cloudinary) com galeria/lightbox
- 🔀 **Reordenação por drag-and-drop** dos itens
- 💾 **Backups automáticos** (até 10) e restauração
- 👁️ **Preview** das alterações antes de salvar
- 🎨 **Ícones SVG inline** no lugar de emoji — mesma forma em todo sistema,
  sem depender de fonte de emoji (o admin continua cadastrando emoji: eles são
  convertidos automaticamente)
- 📄 **Exportação para PDF/impressão** otimizada (ATS)
- 📊 **Contador de visitas**
- ☁️ **Dados na nuvem** (JSONBin) — edição reflete no CV ao salvar

---

## 🎛️ Como o motor de scroll funciona

Toda a experiência é feita **sem bibliotecas externas** (`js/controller/story.js`),
por três motivos: nada de payload extra, controle total de performance e
nenhuma dependência para manter.

**Performance**
- Um único listener de scroll (passivo) que apenas agenda um `requestAnimationFrame`
- Leituras de layout agrupadas **antes** de qualquer escrita de estilo (evita
  *layout thrashing*); medidas ficam em cache e só são refeitas em `resize`
- Só `transform` e `opacity` são animados
- Medido em ~60 fps na página inteira (mediana de 16,7 ms por frame)

**Trilhos horizontais**
O trilho é um contêiner de scroll nativo (`overflow-x`) com *scroll snap*. O
scroll vertical da página **não** é convertido em movimento lateral: rolar para
baixo continua rolando para baixo. O deslocamento lateral vem sempre de uma
ação do visitante — arrastar com o mouse, deslizar no touch, girar o trackpad,
usar as setas ou os botões do trilho.

Isso é deliberado. Uma versão anterior prendia a seção na tela e convertia
scroll vertical em horizontal; com conteúdo real (descrições longas, muitos
resultados por cargo) o cartão passou a ter altura fixa, o conteúdo vazava pela
borda e o cabeçalho encolhia, jogando o marcador da linha do tempo por cima do
título. Sem a fixação, cada cartão simplesmente cresce com o conteúdo.

**Acessibilidade**
- `prefers-reduced-motion`: desliga parallax, transições e o scroll suave dos
  trilhos; o conteúdo continua todo visível
- O scroll nativo **nunca** é sequestrado (sem *smooth scroll* customizado)
- Trilhos navegáveis por teclado (Tab, ← →, botões); dar Tab em um cartão fora
  da tela o traz para a viewport pelo comportamento nativo do navegador
- Barra de rolagem visível no trilho, além do cursor de arrasto: o conteúdo
  lateral não fica escondido
- Diálogos (galeria e portfólio) com foco preso, `Esc` e devolução do foco
- Sem JS, o conteúdo continua visível e legível

O mesmo comportamento vale em qualquer tela: não há modo alternativo por
largura ou altura, então nada muda de lugar ao redimensionar a janela.

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
├── controller/   → lógica, motor de scroll e comunicação com as APIs
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
│   ├── variables.css           # Design tokens (cores, escalas, easing)
│   ├── base.css                # Reset e base
│   ├── index.css               # Estilos do CV público (narrativa em scroll)
│   ├── admin.css               # Estilos do painel admin
│   └── print.css               # Estilos de impressão/PDF (ATS)
│
├── js/
│   ├── utils.js
│   ├── model/
│   │   ├── defaults.js         # Conteúdo padrão do CV
│   │   └── state.js            # Estado + merge com a nuvem
│   ├── view/
│   │   ├── index-view.js       # Monta os capítulos a partir dos dados
│   │   └── admin-view.js
│   └── controller/
│       ├── api.js              # Chamadas às serverless functions
│       ├── story.js            # Motor de scroll (revelação, trilhos, parallax)
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

**Diagnóstico rápido**
Abra `/.netlify/functions/cv-ping` (ou `/api/cv-ping`) no navegador. Além de
listar quais variáveis estão configuradas, ele **testa a conexão real com o
JSONBin** e mostra o status e a mensagem literal da resposta — é isso que
diferencia "a variável existe" de "a variável está correta".

Ao falhar um salvamento, o painel também imprime no console do navegador o
HTTP, o erro e a resposta do JSONBin.

**Erro 401 (Unauthorized) ao salvar**
A senha enviada não bate com `CV_ADMIN_PASSWORD`. Nesse caso a requisição nem
chega ao JSONBin. Confira a variável no host e refaça o login.

**Erro 403 (Forbidden) ao salvar**
A senha do admin está correta (senão seria 401). O 403 vem do **JSONBin** e
significa: `JSONBIN_MASTER_KEY` inválida **ou** o bin pertence a outra conta.
- Confirme que está usando a **Master Key** (em jsonbin.io → *API Keys*), não a Access Key.
- Confirme que o `JSONBIN_BIN_ID` é de um bin **dessa mesma conta**.
- Verifique se a cota mensal de requisições do plano não estourou.
- Atualize a variável no host e faça um novo deploy.

**403 por tamanho do registro**
O JSONBin guarda tudo em **um único registro**, e o plano tem limite de
tamanho. Cada backup automático é uma **cópia completa do CV** dentro desse
mesmo registro — guardar 10 multiplicava o payload por ~11 e o estourava
conforme o conteúdo crescia (leitura continuava funcionando; só a gravação
voltava 403).

Hoje o registro é podado antes de cada envio (`pruneBackupsToFit` em
`js/model/state.js`): no máximo `MAX_BACKUPS` cópias e um teto de
`RECORD_BUDGET` bytes, descartando os backups mais antigos primeiro. A aba
*Configurações* do admin mostra o peso atual com uma barra de alerta.

> ⚠️ O contador de visitas grava no mesmo bin a cada acesso (lê e regrava o
> registro inteiro). Isso consome cota do JSONBin proporcionalmente ao tráfego
> e, em teoria, pode competir com um salvamento feito no admin no mesmo
> instante. Se a cota for um problema, desligar o `trackVisit` no
> `index-controller.js` corta duas requisições por visita.

**Acentos/caracteres aparecem corrompidos**
As serverless functions leem a resposta do JSONBin com `res.setEncoding('utf8')`.
Sem isso, um caractere multibyte partido entre dois chunks do stream vira `�`
(ex.: `Graduação` → `Gradua��ão`) — de forma intermitente, dependendo do
tamanho do payload.

As respostas das funções e as gravações no JSONBin enviam `charset=utf-8`. Se
ainda houver texto antigo corrompido salvo na nuvem, basta **reeditar e salvar**
pelo painel para regravar o conteúdo já corrigido.

**Imagens não sobem**
Verifique as três variáveis `CLOUDINARY_*`. Cada imagem deve ter no máximo 5 MB.
