/**
 * Model — Dados padrão do CV (DEFAULTS)
 * Fonte única de verdade — compartilhado entre index e admin
 */
export const DEFAULTS = {
  profile: {
    nickname: "Antônio",
    fullname: "Antônio Carlos Cardoso Fagundes Ferreira",
    role: "Analista de CRM · Desenvolvedor Web · Data Science",
    location: "Freguesia do Ó — São Paulo, SP",
    phone: "(11) 99297-8652",
    email: "degofagundes088@gmail.com",
    linkedin: "linkedin.com/in/seu-perfil",
    github: "github.com/seu-usuario",
    whatsapp: "5511992978652",
    portfolio: "",
    available: true
  },
  heroStats: [
    { label: "Experiência", val: "3+ anos · CRM & Dev", ico: "💼" },
    { label: "Formação",    val: "FIAP · FECAP",        ico: "🎓" },
    { label: "Pós-Grad.",  val: "Data Science · 2026",  ico: "📊" },
    { label: "Localização", val: "São Paulo, SP",        ico: "📍" }
  ],
  objective: "Com mais de <strong>3 anos de experiência</strong> na interseção entre CRM e desenvolvimento de software, atuo na FECAP como Analista de CRM e Desenvolvedor Web — construindo uma trajetória marcada por resultados mensuráveis. Lidero tecnicamente integrações com o <strong>Microsoft Dynamics 365</strong> e o desenvolvimento de soluções em <strong>Power Platform</strong>, incluindo um sistema de gestão de fila que reduziu o tempo de espera de 3 horas para 30 minutos (<span class='metric'>↓83%</span>). Em paralelo, consolido minha formação em <strong>Data Science</strong> pela FIAP e avanço na pós-graduação na FECAP com foco em analytics aplicado a finanças. Meu diferencial é combinar visão estratégica de CRM com a capacidade técnica de desenvolver e automatizar soluções <em>end-to-end</em>.",
  objetivo: "Busco oportunidades em <strong>desenvolvimento de software</strong> e <strong>análise de dados</strong>, onde possa aplicar minha experiência em CRM, automação de processos e ciência de dados para gerar resultados concretos. Tenho interesse especial em posições que combinem visão estratégica e execução técnica, preferencialmente em empresas com cultura de inovação.",
  tags: ["Dynamics 365", "Power Platform", "Python", "PHP", "SQL", "Data Science", "SendGrid", "ETL", "Machine Learning", "Azure", "Node.js"],
  skills: [
    { name: "Microsoft Dynamics 365", category: "advanced" },
    { name: "Office 365 / Excel / VBA", category: "advanced" },
    { name: "Google Workspace", category: "advanced" },
    { name: "E-mail Marketing (SendGrid)", category: "advanced" },
    { name: "Jira / Trello / Notion", category: "advanced" },
    { name: "Power Platform (Apps + Automate)", category: "intermediate" },
    { name: "PHP", category: "intermediate" },
    { name: "HTML / CSS / JavaScript", category: "intermediate" },
    { name: "SQL", category: "intermediate" },
    { name: "Python", category: "intermediate" },
    { name: "Linux", category: "intermediate" },
    { name: "Machine Learning", category: "intermediate" },
    { name: "Node.js", category: "intermediate" },
    { name: "Inglês — A2", category: "language" }
  ],
  experience: [{
    period: "02/2022 – Presente", color: "g",
    title: "Analista de CRM e Desenvolvedor Web",
    company: "FECAP — São Paulo, SP",
    description: "Sustentação e desenvolvimento de integrações via API no Microsoft Dynamics 365. Liderança técnica no desenvolvimento com Power Platform (App totem digital). Chatbots e automação de campanhas de e-mail com foco em retenção.",
    highlights: ["↓83% no tempo de espera presencial (3h → 30min)", "↓85% no tempo de criação de e-mails (20min → 3min)"]
  }],
  projects: [
    { name: "Digitalização de Fila Presencial", stack: "Power Apps · Power Automate", color: "g", featured: true, description: "Sistema de gestão de senhas com Power Platform. Alunos aguardam em sala em vez de filas físicas, reduzindo evasão.", result: "↓83% no tempo de espera (3h → 30min)", pills: ["Power Apps", "Power Automate", "UX Design"], images: [] },
    { name: "Gerador de E-mails Integrado ao CRM", stack: "PHP · Dynamics 365 · TinyMCE", color: "c", featured: true, description: "Gerador integrado ao Dynamics CRM, eliminando edição manual. Padronizou layouts com elementos variáveis e centralizou KPIs.", result: "↓85% no tempo de criação (20min → 3min)", pills: ["PHP", "Dynamics 365", "TinyMCE", "HTML/CSS"], images: [] },
    { name: "Análise de Métricas de E-mail Marketing", stack: "SQL · Dashboard · CRM", color: "o", featured: true, description: "Centraliza Taxas de Abertura, CTR, Entregabilidade e Intervalos de Disparo. Filtragem por campanha com exclusão de dados de teste.", result: "Insights em tempo real", pills: ["SQL", "Dashboard", "SendGrid", "Dynamics 365"], images: [] },
    { name: "Aplicativo de Gestão Financeira", stack: "Node.js · CSV · ML Preditivo", color: "p", featured: false, description: "App mobile para gestão financeira pessoal. Importação via CSV e análise preditiva de fluxo de caixa.", result: "Projeção inteligente de saúde financeira", pills: ["Node.js", "JavaScript", "CSV", "ML preditivo"], images: [] }
  ],
  education: [
    { period: "2026", color: "p", title: "Pós-Grad. em Data Science e Analytics", company: "Aplicado a Finanças — FECAP", description: "Especialização em análise de dados financeiros, modelagem preditiva e business intelligence." },
    { period: "2025", color: "c", title: "Graduação em Data Science", company: "FIAP — São Paulo", description: "Machine Learning, Deep Learning, ETL, Cloud Azure, Python, visualização e análise de dados." },
    { period: "2022", color: "p", title: "Análise e Desenvolvimento de Sistemas", company: "FECAP — São Paulo", description: "Desenvolvimento web, banco de dados, arquitetura de sistemas e programação orientada a objetos." }
  ],
  certifications: [
    { emoji: "☁️", name: "Microsoft Azure Fundamentals (AZ-900)", issuer: "Microsoft", year: "2024", certUrl: "" },
    { emoji: "⚡", name: "Power Platform Fundamentals (PL-900)", issuer: "Microsoft", year: "2024", certUrl: "" },
    { emoji: "📊", name: "Dynamics 365 Fundamentals (MB-910)", issuer: "Microsoft", year: "2023", certUrl: "" },
    { emoji: "🤖", name: "Machine Learning — Formação FIAP", issuer: "FIAP", year: "2024", certUrl: "" },
    { emoji: "🐍", name: "Python para Data Science", issuer: "FIAP", year: "2023", certUrl: "" }
  ],
  tech: [
    { emoji: "📊", label: "Dynamics 365" }, { emoji: "⚡", label: "Power Apps" }, { emoji: "🔄", label: "Power Auto." },
    { emoji: "🐘", label: "PHP" }, { emoji: "🐍", label: "Python" }, { emoji: "🗄️", label: "SQL" },
    { emoji: "🌐", label: "HTML/CSS/JS" }, { emoji: "📧", label: "SendGrid" },
    { emoji: "☁️", label: "Azure" }, { emoji: "🤖", label: "ML / AI" }, { emoji: "📋", label: "Excel/VBA" }, { emoji: "🔀", label: "Git/CI-CD" }
  ],
  theme: { textColor: '', textDim: '', textBright: '' }
};
