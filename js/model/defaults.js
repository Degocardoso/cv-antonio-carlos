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
      "name": "Plataforma de Comunicação e Indicadores",
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
      "images": [
        "img/projetos/plataforma-modulos.jpg",
        "img/projetos/emails-painel.jpg",
        "img/projetos/whatsapp-painel.jpg",
        "img/projetos/n2-provas.jpg",
        "img/projetos/escala-semana.jpg"
      ]
    },
    {
      "name": "Digitalização de Fila Presencial",
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
      "images": [
        "https://res.cloudinary.com/cv-antonio/image/upload/v1774707675/cv-portfolio/cv-portfolio/proj-0-1774707675.jpg",
        "https://res.cloudinary.com/cv-antonio/image/upload/v1774707679/cv-portfolio/cv-portfolio/proj-0-1774707679.jpg",
        "https://res.cloudinary.com/cv-antonio/image/upload/v1774707683/cv-portfolio/cv-portfolio/proj-0-1774707683.jpg"
      ]
    },
    {
      "name": "Gerador de E-mails Integrado ao CRM",
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
      "images": [
        "https://res.cloudinary.com/cv-antonio/image/upload/v1774707689/cv-portfolio/cv-portfolio/proj-1-1774707690.png"
      ]
    },
    {
      "name": "Análise de Métricas de E-mail Marketing",
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
      "images": [
        "img/projetos/emails-painel.jpg",
        "img/projetos/emails-funil.jpg",
        "img/projetos/emails-criterios.jpg",
        "img/projetos/emails-enderecos.jpg",
        "https://res.cloudinary.com/cv-antonio/image/upload/v1774707695/cv-portfolio/cv-portfolio/proj-2-1774707695.png"
      ]
    },
    {
      "name": "Acompanhamento N2 — Alunos PCD e Neurodivergentes",
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
      "images": [
        "img/projetos/n2-provas.jpg",
        "img/projetos/n2-aluno.jpg",
        "img/projetos/n2-calendario.jpg",
        "img/projetos/n2-regua.jpg",
        "img/projetos/n2-celular.jpg"
      ]
    },
    {
      "name": "Atendimentos do WhatsApp — Painel de SLA",
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
      "images": [
        "img/projetos/whatsapp-painel.jpg",
        "img/projetos/whatsapp-departamentos.jpg",
        "img/projetos/whatsapp-escuro.jpg"
      ]
    },
    {
      "name": "Aplicativo de Gestão Financeira",
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
      "images": []
    },
    {
      "name": "Painel de Relacionamentos — ETL Python → PHP",
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
      "images": []
    },
    {
      "name": "Réguas Automáticas de Relacionamento",
      "stack": "Laravel · Dynamics 365 · Cron",
      "color": "g",
      "featured": false,
      "description": "Motor de jornadas por e-mail. O aluno entra pelo filtro no CRM, por uma base importada ou quando um campo muda de valor. As etapas avançam sozinhas a cada minuto, e os envios passam pela mesma fila de disparos, com as mesmas garantias contra envio em dobro.",
      "result": "Comunicação contínua sem disparo manual",
      "pills": [
        "PHP",
        "Laravel",
        "Dynamics 365",
        "Automação"
      ],
      "images": []
    },
    {
      "name": "Gerador de Escala de Atendentes",
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
      "images": [
        "img/projetos/escala-semana.jpg",
        "img/projetos/escala-link-publico.jpg",
        "img/projetos/escala-celular.jpg",
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
  "backups": [],
  "objetivo": "Busco oportunidades em <strong>desenvolvimento de software</strong> (back-end PHP/Laravel, integrações e APIs) e em <strong>análise e engenharia de dados</strong> (ETL, SQL, Power BI), onde eu possa aplicar o que construí em produção: sistemas que automatizam processos, integram plataformas e transformam dados de CRM em indicadores para decisão. Tenho interesse especial em posições que combinem visão de negócio e execução técnica."
};
