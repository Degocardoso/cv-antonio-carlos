/**
 * Model — Dados padrão do CV (DEFAULTS)
 * Fonte única de verdade — compartilhado entre index e admin
 * Gerado em: 2026-03-28 · Atualizado em: 2026-11-16
 */
export const DEFAULTS = {
  "profile": {
    "nickname": "Antônio",
    "fullname": "Carlos Cardoso Fagundes Ferreira",
    "role": "Analista de CRM · Desenvolvedor Web · Data Science",
    "location": "Freguesia do Ó — São Paulo, SP",
    "phone": "(11) 99297-8652",
    "email": "degofagundes088@gmail.com",
    "linkedin": "www.linkedin.com/in/antonio-carlos-cardoso/",
    "github": "github.com/Degocardoso",
    "whatsapp": "5511992978652",
    "portfolio": "",
    "pdfUrl": "",
    "photo": "",
    "available": true
  },
  "heroStats": [
    {
      "ico": "💼",
      "label": "Experiência",
      "val": "4+ anos — CRM, Dev & Dados"
    },
    {
      "ico": "🎓",
      "label": "Graduações",
      "val": "Data Science — FIAP | ADS — FECAP"
    },
    {
      "ico": "📍",
      "label": "Localização",
      "val": "São Paulo, SP"
    },
    {
      "ico": "⭐",
      "label": "Idade",
      "val": "24 Anos"
    }
  ],
  "objective": "Há quase <strong>5 anos</strong> atuo na FECAP na interseção entre CRM, desenvolvimento de software e dados. Criei e mantenho em produção a <strong>plataforma interna de comunicação e indicadores</strong> da área de relacionamento: um sistema em <strong>PHP/Laravel e MySQL</strong> com mais de 12 módulos, integrado ao <strong>Microsoft Dynamics 365</strong>, ao WhatsApp (WorkNow) e ao <strong>Power BI</strong>. Ele cuida de e-mails, disparos agendados, réguas automáticas de relacionamento, painéis, escala de atendentes e avaliação de qualidade. Também liderei soluções em <strong>Power Platform</strong>, como o totem de senhas que reduziu a espera presencial de 3 horas para 30 minutos (<span class='metric'>↓83%</span>). Sou formado em <strong>Data Science</strong> (FIAP) e em Análise e Desenvolvimento de Sistemas (FECAP). Meu diferencial é unir a visão do negócio à execução técnica <em>end-to-end</em>: da regra da área ao código em produção, validado com dados reais. Uso desenvolvimento assistido por IA (Claude Code) no dia a dia.",
  "tags": [
    "PHP / Laravel",
    "MySQL",
    "Dynamics 365",
    "APIs REST",
    "Power BI",
    "Power Platform",
    "Python",
    "ETL",
    "Data Science",
    "Machine Learning",
    "Node.js",
    "Azure / Entra ID"
  ],
  "skills": [
    {
      "name": "Microsoft Dynamics 365",
      "category": "advanced"
    },
    {
      "name": "Office 365 / Excel / VBA",
      "category": "advanced"
    },
    {
      "name": "Google Workspace",
      "category": "advanced"
    },
    {
      "name": "E-mail Marketing (SendGrid)",
      "category": "advanced"
    },
    {
      "name": "Jira / Trello / Notion",
      "category": "advanced"
    },
    {
      "name": "Dynamics 365 Web API / FetchXML",
      "category": "advanced"
    },
    {
      "name": "PHP / Laravel",
      "category": "intermediate"
    },
    {
      "name": "SQL / MySQL",
      "category": "intermediate"
    },
    {
      "name": "APIs REST / OData / OAuth 2.0",
      "category": "intermediate"
    },
    {
      "name": "ETL e modelagem de dados",
      "category": "intermediate"
    },
    {
      "name": "Power BI",
      "category": "intermediate"
    },
    {
      "name": "Power Platform (Apps + Automate)",
      "category": "intermediate"
    },
    {
      "name": "HTML / CSS / JavaScript",
      "category": "intermediate"
    },
    {
      "name": "Git / GitHub",
      "category": "intermediate"
    },
    {
      "name": "Desenvolvimento assistido por IA (Claude Code)",
      "category": "intermediate"
    },
    {
      "name": "Python",
      "category": "intermediate"
    },
    {
      "name": "Linux",
      "category": "intermediate"
    },
    {
      "name": "Machine Learning",
      "category": "intermediate"
    },
    {
      "name": "Node.js",
      "category": "intermediate"
    },
  ],
  "experience": [
    {
      "period": "02/2022 – Presente",
      "color": "g",
      "title": "Analista de CRM e Desenvolvedor Web",
      "company": "FECAP — São Paulo, SP",
      "description": "Criei e mantenho a plataforma interna de comunicação e indicadores (PHP/Laravel + MySQL). Ela gera e-mails, agenda disparos em lotes, roda réguas automáticas de relacionamento e reúne os painéis da área. Integra o Dynamics 365 (Web API, FetchXML), a API do WorkNow (WhatsApp, com cálculo de SLA) e o Power BI, por APIs OData. Login com conta Microsoft (Entra ID) e permissões por perfil. Também liderei soluções em Power Platform (totem de senhas) e fiz chatbots de atendimento.",
      "highlights": [
        "↓83% no tempo de espera presencial (3h → 30min)",
        "↓85% no tempo de criação de e-mails (20min → 3min)",
        "12+ módulos em produção numa plataforma Laravel própria",
        "107 mil registros validados contra o sistema original na migração Python → PHP"
      ],
      "results": [
        "↓83% no tempo de espera presencial (3h → 30min)",
        "↓85% no tempo de criação de e-mails (20min → 3min)"
      ]
    }
  ],
  "projects": [
    {
      "id": "plataforma",
      "name": "Plataforma de Comunicação e Indicadores",
      "shortName": "Plataforma",
      "stack": "Laravel · MySQL · Dynamics 365 · Power BI",
      "color": "c",
      "featured": true,
      "description": "Sistema interno da área de relacionamento da FECAP, levado de PHP puro para Laravel 8 e ampliado para mais de 12 módulos: gerador de e-mails, disparos agendados, réguas automáticas, relatórios com exportação (CSV, Excel, PDF, XML), painéis, escala de atendentes, avaliação de qualidade e acompanhamento de alunos. Tarefas agendadas pelo cron do Laravel, login Microsoft (OpenID Connect + PKCE) e APIs OData para o Power BI.",
      "result": "12+ módulos em produção, com um único login",
      "pills": [
        "PHP",
        "Laravel",
        "MySQL",
        "Dynamics 365",
        "OData",
        "Entra ID"
      ],
      "links": [
        {
          "to": "gerador",
          "why": "É um dos módulos da plataforma."
        },
        {
          "to": "reguas",
          "why": "É um dos módulos da plataforma."
        },
        {
          "to": "metricas",
          "why": "É um dos módulos da plataforma."
        },
        {
          "to": "whatsapp",
          "why": "É um dos módulos da plataforma."
        },
        {
          "to": "relacionamentos",
          "why": "É um dos módulos da plataforma."
        },
        {
          "to": "n2",
          "why": "É um dos módulos da plataforma."
        },
        {
          "to": "escala",
          "why": "É um dos módulos da plataforma."
        }
      ],
      "images": [
        "img/projetos/plataforma-modulos.jpg",
        "img/projetos/emails-painel.jpg",
        "img/projetos/whatsapp-painel.jpg",
        "img/projetos/n2-provas.jpg",
        "img/projetos/escala-semana.jpg"
      ]
    },
    {
      "id": "fila",
      "name": "Digitalização de Fila Presencial",
      "shortName": "Fila presencial",
      "stack": "Power Apps · Power Automate",
      "color": "g",
      "featured": true,
      "description": "Sistema de gestão de senhas com Power Platform. Alunos aguardam em sala de aula em vez de filas físicas, reduzindo evasão.",
      "result": "↓83% no tempo de espera (3h → 30min)",
      "pills": [
        "Power Apps",
        "Power Automate",
        "UX Design"
      ],
      "links": [
        {
          "to": "relacionamentos",
          "why": "A pesquisa de satisfação das mesas grava no CRM e alimenta o painel de relacionamentos."
        }
      ],
      "images": [
        "https://res.cloudinary.com/cv-antonio/image/upload/v1774707675/cv-portfolio/cv-portfolio/proj-0-1774707675.jpg",
        "https://res.cloudinary.com/cv-antonio/image/upload/v1774707679/cv-portfolio/cv-portfolio/proj-0-1774707679.jpg",
        "https://res.cloudinary.com/cv-antonio/image/upload/v1774707683/cv-portfolio/cv-portfolio/proj-0-1774707683.jpg"
      ]
    },
    {
      "id": "gerador",
      "name": "Gerador de E-mails Integrado ao CRM",
      "shortName": "Gerador de e-mails",
      "stack": "PHP · Laravel · Dynamics 365 · TinyMCE",
      "color": "c",
      "featured": true,
      "description": "Gerador integrado ao Dynamics CRM que acabou com a edição manual de código. Padroniza layouts com elementos variáveis (botões, tabelas, campos do contato) e guarda versões a cada edição. Os disparos ficam numa fila agendada: a base sai do CRM por FetchXML, sem duplicados nem bloqueados, e o envio vai em lotes com retentativa e trava contra envio em dobro.",
      "result": "↓85% no tempo de criação (20min → 3min)",
      "pills": [
        "PHP",
        "Laravel",
        "Dynamics 365",
        "FetchXML",
        "TinyMCE",
        "HTML/CSS"
      ],
      "links": [
        {
          "to": "reguas",
          "why": "As réguas enviam os e-mails montados no gerador."
        },
        {
          "to": "metricas",
          "why": "Cada e-mail criado no gerador é medido no painel de e-mails."
        }
      ],
      "images": [
        "https://res.cloudinary.com/cv-antonio/image/upload/v1774707689/cv-portfolio/cv-portfolio/proj-1-1774707690.png"
      ]
    },
    {
      "id": "metricas",
      "name": "Análise de Métricas de E-mail Marketing",
      "shortName": "Métricas de e-mail",
      "stack": "SQL · Laravel · Chart.js · Dynamics 365",
      "color": "o",
      "featured": true,
      "description": "Reúne os indicadores de e-mail marketing (abertura, CTR, entregabilidade e intervalos de disparo), com filtro por campanha e período e exclusão automática dos envios de teste. Os dados vêm do CRM por uma sincronização incremental com reconciliação, e o relatório exporta em CSV, Excel, PDF e XML.",
      "result": "Insights em tempo real sobre performance",
      "pills": [
        "SQL",
        "Dashboard",
        "Chart.js",
        "SendGrid",
        "Dynamics 365"
      ],
      "links": [],
      "images": [
        "img/projetos/emails-painel.jpg",
        "img/projetos/emails-funil.jpg",
        "img/projetos/emails-criterios.jpg",
        "img/projetos/emails-enderecos.jpg",
        "https://res.cloudinary.com/cv-antonio/image/upload/v1774707695/cv-portfolio/cv-portfolio/proj-2-1774707695.png"
      ]
    },
    {
      "id": "n2",
      "name": "Acompanhamento N2 — Alunos PCD e Neurodivergentes",
      "shortName": "Provas adaptadas (N2)",
      "stack": "Laravel · MySQL · Dynamics 365 · Réguas de e-mail",
      "color": "p",
      "featured": true,
      "description": "Módulo que organiza as provas adaptadas dos alunos PCD e neurodivergentes. Importa a planilha do semestre, liga cada aluno ao CRM e reúne tempo de prova, orientações aos professores, agenda, salas e faltas. Uma régua de e-mails pede aos professores as datas das provas, que eles informam num formulário próprio, e a equipe vê na hora o que está pendente.",
      "result": "Provas adaptadas organizadas do pedido à sala",
      "pills": [
        "PHP",
        "Laravel",
        "Dynamics 365",
        "Acessibilidade",
        "Automação"
      ],
      "links": [
        {
          "to": "gerador",
          "why": "Os e-mails que cobram as datas de prova dos professores saem do gerador."
        }
      ],
      "images": [
        "img/projetos/n2-provas.jpg",
        "img/projetos/n2-aluno.jpg",
        "img/projetos/n2-calendario.jpg",
        "img/projetos/n2-regua.jpg",
        "img/projetos/n2-celular.jpg"
      ]
    },
    {
      "id": "whatsapp",
      "name": "Atendimentos do WhatsApp — Painel de SLA",
      "shortName": "WhatsApp (SLA)",
      "stack": "Laravel · API WorkNow · OData · Power BI",
      "color": "g",
      "featured": true,
      "description": "Painel dos atendimentos do WhatsApp. Sincroniza os tickets pela API da WorkNow e calcula as regras de SLA: espera na fila, resolução, abandono e satisfação. Mostra por dia, departamento e atendente, comparando com o período anterior, e entrega os mesmos números ao Power BI por uma API OData.",
      "result": "Fila, espera, abandono e satisfação num só painel",
      "pills": [
        "PHP",
        "Laravel",
        "API REST",
        "OData",
        "Power BI"
      ],
      "links": [],
      "images": [
        "img/projetos/whatsapp-painel.jpg",
        "img/projetos/whatsapp-departamentos.jpg",
        "img/projetos/whatsapp-escuro.jpg"
      ]
    },
    {
      "id": "financas",
      "name": "Aplicativo de Gestão Financeira",
      "shortName": "Finanças pessoais",
      "stack": "Node.js · CSV · ML Preditivo",
      "color": "p",
      "featured": false,
      "description": "App mobile para gestão financeira pessoal. Importação de dados bancários via CSV e análise preditiva de fluxo de caixa.",
      "result": "Projeção inteligente de saúde financeira",
      "pills": [
        "Node.js",
        "JavaScript",
        "CSV",
        "ML preditivo"
      ],
      "links": [],
      "images": []
    },
    {
      "id": "relacionamentos",
      "name": "Painel de Relacionamentos — ETL Python → PHP",
      "shortName": "Painel de relacionamentos",
      "stack": "ETL · MySQL · Python · Laravel",
      "color": "p",
      "featured": true,
      "description": "Migração de um painel de atendimentos de Python/SQLite para Laravel/MySQL. O pipeline sincroniza de hora em hora: extrai do CRM, grava tabelas brutas e monta dimensões e fato. O painel traz satisfação, rankings de motivos, 13 filtros e nuvem de palavras. Um comando de comparação automática conferiu o resultado contra o sistema original, linha a linha e seção a seção.",
      "result": "107 mil registros idênticos ao sistema original",
      "pills": [
        "ETL",
        "MySQL",
        "SQLite",
        "Python",
        "Laravel",
        "Chart.js"
      ],
      "links": [],
      "images": [
        "img/projetos/etl-fluxo.jpg"
      ]
    },
    {
      "id": "reguas",
      "name": "Réguas Automáticas de Relacionamento",
      "shortName": "Réguas automáticas",
      "stack": "Laravel · Dynamics 365 · Cron",
      "color": "g",
      "featured": false,
      "description": "Motor de jornadas por e-mail. O aluno entra pelo filtro no CRM, por uma base importada ou quando um campo muda de valor. A régua combina etapas de e-mail, espera, condição, variação por perfil e registro no CRM, que avançam sozinhas a cada minuto. Os envios passam pela mesma fila de disparos, com as mesmas garantias contra envio em dobro.",
      "result": "Comunicação contínua sem disparo manual",
      "pills": [
        "PHP",
        "Laravel",
        "Dynamics 365",
        "Automação"
      ],
      "links": [
        {
          "to": "metricas",
          "why": "Os envios automáticos das réguas também entram no painel de e-mails."
        }
      ],
      "images": [
        "img/projetos/reguas-fluxo.jpg"
      ]
    },
    {
      "id": "escala",
      "name": "Gerador de Escala de Atendentes",
      "shortName": "Escala da equipe",
      "stack": "PHP · Motor de regras · PDF",
      "color": "o",
      "featured": false,
      "description": "Motor de regras que gera e confere a escala da equipe por canal (presencial, backoffice e home office), com cobertura de almoço, folgas, feriados e ausências. Tem correção automática ao salvar e exportação em PDF.",
      "result": "Escala gerada e conferida automaticamente",
      "pills": [
        "PHP",
        "Laravel",
        "Algoritmos",
        "PDF"
      ],
      "links": [
        {
          "to": "whatsapp",
          "why": "A escala define quem atende o WhatsApp em cada turno, e o painel mede esse atendimento."
        }
      ],
      "images": [
        "img/projetos/escala-semana.jpg",
        "img/projetos/escala-link-publico.jpg",
        "img/projetos/escala-celular-v2.jpg",
        "img/projetos/escala-atendentes.jpg",
        "img/projetos/escala-atendentes-escuro.jpg"
      ]
    }
  ],
  "education": [
    {
      "period": "2025",
      "color": "c",
      "title": "Graduação em Data Science",
      "company": "FIAP",
      "description": "Machine Learning, Deep Learning, ETL, Cloud Azure, Python, visualização e análise de dados."
    },
    {
      "period": "2022",
      "color": "p",
      "title": "Graduação em Análise e Desenvolvimento de Sistemas",
      "company": "FECAP",
      "description": "Desenvolvimento web, banco de dados, arquitetura de sistemas e programação orientada a objetos."
    }
  ],
  "certifications": [
    {
      "emoji": "📜",
      "year": "2024",
      "issuer": "FIAP",
      "name": "Linux Fundamentos",
      "certUrl": "https://on.fiap.com.br/local/nanocourses/gerar_certificado.php?chave=33df328b2a178eec8f6f2cc58810fcd7&action=view"
    },
    {
      "emoji": "📜",
      "year": "2025",
      "issuer": "FIAP",
      "name": "Ingestão e Tratamento de Dados",
      "certUrl": ""
    },
    {
      "emoji": "📊",
      "year": "2025",
      "issuer": "FIAP",
      "name": "Data Visualization",
      "certUrl": ""
    }
  ],
  "tech": [
    {
      "emoji": "📊",
      "label": "Dynamics 365"
    },
    {
      "emoji": "⚡",
      "label": "Power Apps"
    },
    {
      "emoji": "🔄",
      "label": "Power Auto."
    },
    {
      "emoji": "🐘",
      "label": "PHP"
    },
    {
      "emoji": "🧱",
      "label": "Laravel"
    },
    {
      "emoji": "🐬",
      "label": "MySQL"
    },
    {
      "emoji": "📈",
      "label": "Power BI"
    },
    {
      "emoji": "🐍",
      "label": "Python"
    },
    {
      "emoji": "🗄️",
      "label": "SQL"
    },
    {
      "emoji": "🌐",
      "label": "HTML/CSS/JS"
    },
    {
      "emoji": "📧",
      "label": "SendGrid"
    },
    {
      "emoji": "☁️",
      "label": "Azure"
    },
    {
      "emoji": "🤖",
      "label": "ML / AI"
    },
    {
      "emoji": "📋",
      "label": "Excel/VBA"
    },
    {
      "emoji": "🔀",
      "label": "Git/GitHub"
    }
  ],
  "languages": [
    {
      "name": "Português",
      "level": "C2",
      "label": "Nativo",
      "percent": 100
    },
    {
      "name": "Inglês",
      "level": "A2",
      "label": "Básico",
      "percent": 25
    }
  ],
  "theme": {
    "mode": "dark",
    "dark": {
      "textColor": "#c9d1d9",
      "textDim": "#6e7f95",
      "textBright": "#e6edf3"
    },
    "light": {
      "textColor": "#1f2328",
      "textDim": "#656d76",
      "textBright": "#1f2328"
    },
    "typography": {
      "fontFamily": "",
      "fsHero": "",
      "fsSectionTitle": "",
      "fsBody": "",
      "fsDescription": "",
      "fsLabel": "",
      "fsSmall": "",
      "fsTiny": "",
      "fsItemTitle": ""
    }
  },
  "sections": {
    "about": true,
    "objective": true,
    "experience": true,
    "projects": true,
    "skills": true,
    "education": true,
    "certifications": true,
    "tech": true,
    "languages": true,
    "heroStats": true,
    "tags": true
  },
  "i18n": {
    "enabled": false,
    "default": "pt",
    "en": {
      "objective": "",
      "objetivo": "",
      "role": "",
      "labels": {
        "about": "About Me",
        "objective": "Objective",
        "experience": "Professional Experience",
        "projects": "Featured Projects",
        "skills": "Technical Skills",
        "education": "Education",
        "certifications": "Certifications & Courses",
        "tech": "Tech Stack",
        "languages": "Languages"
      },
      "experience": [],
      "projects": [],
      "education": [],
      "certifications": []
    }
  },
  "chapterOrder": ["work", "proof", "about", "journey", "craft", "contact"],
  "chapters": {
    "work":    { "nav": "", "kicker": "", "title": "", "sub": "" },
    "proof":   { "nav": "", "kicker": "", "title": "", "sub": "" },
    "about":   { "nav": "", "kicker": "", "title": "", "sub": "" },
    "journey": { "nav": "", "kicker": "", "title": "", "sub": "" },
    "craft":   { "nav": "", "kicker": "", "title": "", "sub": "" },
    "contact": { "nav": "", "kicker": "", "title": "", "sub": "" }
  },
  "uiText": {
    "hello": "", "seeWork": "", "scrollCue": "", "online": "", "talk": "",
    "work": "", "study": "",
    "journeyEndKind": "", "journeyEndTitle": "", "journeyEndDesc": "", "journeyEndLink": "",
    "seeAllTitle": "", "seeAllDesc": "", "seeAll": "",
    "skills": "", "languages": ""
  },
  "story": {
    "title": "Plataforma de Comunicação e Indicadores",
    "subtitle": "como foi construída",
    "lead": "Um sistema que começou com um problema de fila e hoje tem 12 módulos. Role, ou use as setas, e veja cada problema virar um bloco.",
    "steps": [
      {
        "label": "2022 · chegada",
        "cat": "crm",
        "title": "Entrei no time de CRM",
        "text": "Comecei na FECAP mantendo as integrações com o Microsoft Dynamics 365 e os chatbots que respondem os alunos. Foi ali que eu entendi como os dados de cada aluno circulam pela faculdade.",
        "before": "",
        "after": "",
        "measure": "",
        "project": "plataforma",
        "code": "",
        "blocks": [
          {
            "id": "crm",
            "name": "Dynamics 365",
            "sub": "o CRM da FECAP",
            "cat": "crm",
            "col": 2,
            "row": 3,
            "links": [
              "chatbot",
              "paineis",
              "etl"
            ]
          },
          {
            "id": "chatbot",
            "name": "Chatbots",
            "sub": "atendimento digital",
            "cat": "atend",
            "col": 1,
            "row": 1,
            "links": []
          }
        ]
      },
      {
        "label": "o primeiro grande problema",
        "cat": "atend",
        "title": "Uma fila de 3 horas",
        "text": "No atendimento presencial, alunos esperavam em pé por horas. Criei um sistema de senhas em Power Apps: o aluno pega a senha, volta para a sala e acompanha a chamada pelo celular.",
        "before": "3 h",
        "after": "30 min",
        "measure": "espera média",
        "project": "fila",
        "code": "",
        "blocks": [
          {
            "id": "totem",
            "name": "Totem de senhas",
            "sub": "Power Apps, depois Python",
            "cat": "atend",
            "col": 1,
            "row": 3,
            "links": [
              "crm"
            ]
          }
        ]
      },
      {
        "label": "automação",
        "cat": "auto",
        "title": "20 minutos para montar um e-mail",
        "text": "Cada e-mail para os alunos era escrito à mão, em HTML. Fiz um gerador ligado ao CRM: a pessoa escolhe o modelo, preenche os campos e o e-mail sai pronto, com o nome de cada aluno.",
        "before": "20 min",
        "after": "3 min",
        "measure": "por e-mail",
        "project": "gerador",
        "code": "",
        "blocks": [
          {
            "id": "gerador",
            "name": "Gerador de e-mails",
            "sub": "modelos + variáveis",
            "cat": "auto",
            "col": 3,
            "row": 1,
            "links": [
              "crm"
            ]
          }
        ]
      },
      {
        "label": "automação",
        "cat": "auto",
        "title": "E-mails que saem sozinhos",
        "text": "Os envios passaram para uma fila agendada, em lotes e com trava para nunca mandar o mesmo e-mail duas vezes. Depois vieram as réguas: jornadas de e-mail que andam sozinhas conforme o aluno muda no CRM.",
        "before": "",
        "after": "",
        "measure": "",
        "project": "reguas",
        "code": "// app/Console/Kernel.php\n$schedule->command('disparos:processar')\n         ->everyMinute()\n         ->withoutOverlapping(5);",
        "blocks": [
          {
            "id": "disparos",
            "name": "Fila de disparos",
            "sub": "disparos:processar",
            "cat": "auto",
            "col": 3,
            "row": 2,
            "links": [
              "crm"
            ]
          },
          {
            "id": "reguas",
            "name": "Réguas",
            "sub": "reguas:processar",
            "cat": "auto",
            "col": 3,
            "row": 3,
            "links": [
              "disparos"
            ]
          }
        ]
      },
      {
        "label": "dados",
        "cat": "dados",
        "title": "Medir tudo o que acontece",
        "text": "Com os envios no automático, faltava enxergar o resultado. Construí painéis de e-mail e dos atendimentos no WhatsApp, que comparam cada número com o período anterior, e liguei tudo ao Power BI.",
        "before": "",
        "after": "",
        "measure": "",
        "project": "whatsapp",
        "code": "",
        "blocks": [
          {
            "id": "worknow",
            "name": "WhatsApp",
            "sub": "API da WorkNow",
            "cat": "atend",
            "col": 1,
            "row": 2,
            "links": [
              "paineis"
            ]
          },
          {
            "id": "paineis",
            "name": "Painéis",
            "sub": "e-mails e atendimentos",
            "cat": "dados",
            "col": 2,
            "row": 4,
            "links": [
              "powerbi"
            ]
          },
          {
            "id": "powerbi",
            "name": "Power BI",
            "sub": "APIs OData",
            "cat": "dados",
            "col": 2,
            "row": 5,
            "links": []
          }
        ]
      },
      {
        "label": "dados",
        "cat": "dados",
        "title": "Trazer um painel de Python para casa",
        "text": "Um painel de atendimentos rodava à parte, em Python. Migrei para o sistema, em PHP e MySQL, e escrevi um comparador para provar, registro por registro, que nada tinha mudado. Em 2025, me formei em Data Science pela FIAP.",
        "before": "Python",
        "after": "PHP",
        "measure": "107.714 registros, nenhuma diferença",
        "project": "relacionamentos",
        "code": "",
        "blocks": [
          {
            "id": "etl",
            "name": "Relacionamentos",
            "sub": "ETL de hora em hora",
            "cat": "dados",
            "col": 2,
            "row": 1,
            "links": []
          }
        ]
      },
      {
        "label": "2026 · de volta à fila",
        "cat": "atend",
        "title": "Tirar a fila do Power Apps",
        "text": "O totem de senhas tinha virado peça central do atendimento. Reescrevi o conjunto em código, falando direto com o CRM e sem Power Automate no meio: o totem e o painel que chama as senhas, em Python, já estão em produção, e um app Android para a pesquisa de satisfação nas mesas está em testes.",
        "before": "",
        "after": "",
        "measure": "",
        "project": "fila",
        "code": "",
        "blocks": [
          {
            "id": "chamada",
            "name": "Painel de chamada",
            "sub": "Python + Dataverse",
            "cat": "atend",
            "col": 1,
            "row": 5,
            "links": [
              "crm"
            ]
          },
          {
            "id": "pesquisa",
            "name": "Pesquisa nas mesas",
            "sub": "app Android",
            "cat": "atend",
            "col": 3,
            "row": 5,
            "links": [
              "crm"
            ]
          }
        ]
      },
      {
        "label": "pessoas",
        "cat": "atend",
        "title": "Software para cuidar de gente",
        "text": "O sistema chegou a quem atende e a quem precisa de mais atenção: a escala da equipe por canal e o acompanhamento das provas adaptadas dos alunos PCD e neurodivergentes, com cobrança automática dos professores.",
        "before": "",
        "after": "",
        "measure": "",
        "project": "n2",
        "code": "",
        "blocks": [
          {
            "id": "n2",
            "name": "Provas adaptadas",
            "sub": "alunos PCD (N2)",
            "cat": "atend",
            "col": 1,
            "row": 4,
            "links": [
              "crm"
            ]
          },
          {
            "id": "escala",
            "name": "Escala da equipe",
            "sub": "escala:gerar",
            "cat": "auto",
            "col": 3,
            "row": 4,
            "links": []
          }
        ]
      },
      {
        "label": "hoje",
        "cat": "crm",
        "title": "12 módulos, um login",
        "text": "Tudo isso roda hoje no mesmo sistema, com tarefas agendadas a cada minuto e um login com a conta Microsoft da FECAP. Uso IA no dia a dia para escrever, revisar e testar o código mais rápido.",
        "before": "",
        "after": "",
        "measure": "",
        "project": "plataforma",
        "code": "",
        "blocks": []
      }
    ]
  },
  "backups": [],
  "objetivo": "Busco oportunidades em <strong>desenvolvimento de software</strong> (back-end PHP/Laravel, integrações e APIs) e em <strong>análise e engenharia de dados</strong> (ETL, SQL, Power BI), onde eu possa aplicar o que construí em produção: sistemas que automatizam processos, integram plataformas e transformam dados de CRM em indicadores para decisão. Tenho interesse especial em posições que combinem visão de negócio e execução técnica."
};
