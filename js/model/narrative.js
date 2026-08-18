/**
 * Model — Textos da narrativa
 *
 * Títulos, subtítulos e rótulos dos capítulos do CV público.
 * Fica no model (e não na view) porque o painel admin também precisa
 * deles: são eles que aparecem como placeholder dos campos, mostrando
 * o texto padrão quando o usuário não escreveu o próprio.
 *
 * Qualquer texto aqui pode ser sobrescrito pelo admin — ver `chapters`
 * e `uiText` em defaults.js. Campo vazio no admin = usa o padrão daqui.
 */

export const NARRATIVE = {
  pt: {
    hello: 'Olá, eu sou',
    online: 'ONLINE · São Paulo, BR',
    scrollCue: 'role para começar a história',
    /* Numeração e kicker são calculados pela ordem no DOM — reordenar as
       seções no HTML basta, nada aqui precisa mudar junto. */
    chapterWord: 'Capítulo',
    ordinals: ['um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito'],
    chapters: {
      work:    { nav: 'Impacto',     title: 'O que eu construí',
                 sub: 'Projetos reais, em produção, com números por trás de cada um.' },
      proof:   { nav: 'Credenciais', title: 'Estudo que não para',
                 sub: 'Certificações e cursos que sustentam a prática do dia a dia.' },
      about:   { nav: 'Origem',      title: 'Quem está por trás',
                 sub: 'O que me move e o tipo de problema que gosto de resolver.' },
      journey: { nav: 'Trajetória',  title: 'A trajetória, ano a ano',
                 sub: 'Formação e carreira avançando lado a lado — continue rolando para percorrer a linha do tempo.' },
      craft:   { nav: 'Arsenal',     title: 'As ferramentas do ofício',
                 sub: 'O que uso para tirar uma ideia do papel e colocá-la em produção.' },
      contact: { nav: 'Contato',     title: 'O próximo capítulo', kicker: 'Epílogo',
                 sub: 'Para onde eu quero levar essa história — e como falar comigo.' }
    },
    skills: 'Habilidades técnicas',
    languages: 'Idiomas',
    allProjects: 'Portfólio completo',
    close: 'Fechar',
    work: 'Trabalho', study: 'Formação',
    journeyEndKind: 'Agora',
    journeyEndTitle: 'E a história continua',
    journeyEndDesc: 'Cada etapa somou uma camada: primeiro o código, depois os dados, hoje a visão de negócio que conecta os dois.',
    journeyEndLink: 'Ver o próximo capítulo',
    results: 'Resultados',
    gallery: 'Ver galeria',
    openGallery: 'Abrir galeria do projeto',
    seeAll: 'Ver tudo',
    seeAllTitle: 'Tem mais história aqui',
    seeAllDesc: 'Estes são os destaques. O portfólio completo traz todos os projetos, com contexto e imagens.',
    featured: 'Destaque',
    projects: 'projetos',
    talk: 'Vamos conversar',
    seeWork: 'Ver os projetos',
    facts: { projects: 'Projetos', education: 'Formações', certs: 'Certificações', tech: 'Tecnologias', where: 'Base' },
    contact: { email: 'E-mail', linkedin: 'LinkedIn', github: 'GitHub', phone: 'Telefone', location: 'Localização', portfolio: 'Portfólio' },
    copyHint: 'clique para copiar',
    downloadCV: 'Baixar CV',
    levels: { advanced: 'Avançado', intermediate: 'Intermediário', basic: 'Básico', language: 'Idiomas' }
  },
  en: {
    hello: "Hi, I'm",
    online: 'ONLINE · São Paulo, BR',
    scrollCue: 'scroll to begin the story',
    chapterWord: 'Chapter',
    ordinals: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'],
    chapters: {
      work:    { nav: 'Impact',      title: 'What I have built',
                 sub: 'Real projects, in production, with numbers behind each one.' },
      proof:   { nav: 'Credentials', title: 'Always learning',
                 sub: 'Certifications and courses that back the day-to-day practice.' },
      about:   { nav: 'Origin',      title: 'Who is behind this',
                 sub: 'What drives me and the kind of problem I like to solve.' },
      journey: { nav: 'Journey',     title: 'The journey, year by year',
                 sub: 'Education and career moving side by side — keep scrolling to walk the timeline.' },
      craft:   { nav: 'Toolkit',     title: 'Tools of the trade',
                 sub: 'What I use to take an idea from paper to production.' },
      contact: { nav: 'Contact',     title: 'The next chapter', kicker: 'Epilogue',
                 sub: 'Where I want to take this story — and how to reach me.' }
    },
    skills: 'Technical skills',
    languages: 'Languages',
    allProjects: 'Full portfolio',
    close: 'Close',
    work: 'Work', study: 'Education',
    journeyEndKind: 'Now',
    journeyEndTitle: 'And the story goes on',
    journeyEndDesc: 'Every step added a layer: first the code, then the data, today the business view that ties both together.',
    journeyEndLink: 'See the next chapter',
    results: 'Results',
    gallery: 'View gallery',
    openGallery: 'Open project gallery',
    seeAll: 'See everything',
    seeAllTitle: 'There is more to this story',
    seeAllDesc: 'These are the highlights. The full portfolio holds every project, with context and images.',
    featured: 'Featured',
    projects: 'projects',
    talk: "Let's talk",
    seeWork: 'See the projects',
    facts: { projects: 'Projects', education: 'Degrees', certs: 'Certifications', tech: 'Technologies', where: 'Based in' },
    contact: { email: 'Email', linkedin: 'LinkedIn', github: 'GitHub', phone: 'Phone', location: 'Location', portfolio: 'Portfolio' },
    copyHint: 'click to copy',
    downloadCV: 'Download CV',
    levels: { advanced: 'Advanced', intermediate: 'Intermediate', basic: 'Basic', language: 'Languages' }
  }
};

/** Ordem padrão dos capítulos (a real vem de `chapterOrder` nos dados). */
export const CHAPTER_KEYS = ['work', 'proof', 'about', 'journey', 'craft', 'contact'];

/** Campos de cada capítulo que o admin pode editar. */
export const CHAPTER_FIELDS = [
  { key: 'nav',    label: 'Menu lateral' },
  { key: 'kicker', label: 'Kicker'       },
  { key: 'title',  label: 'Título'       },
  { key: 'sub',    label: 'Subtítulo'    },
];

/** Textos avulsos da narrativa que o admin pode editar. */
export const UI_TEXT_FIELDS = [
  { key: 'hello',           label: 'Saudação do hero'          },
  { key: 'seeWork',         label: 'Botão principal do hero'   },
  { key: 'scrollCue',       label: 'Convite ao scroll'         },
  { key: 'online',          label: 'Status no topo'            },
  { key: 'talk',            label: 'Botão de contato (topo)'   },
  { key: 'work',            label: 'Etiqueta “trabalho”'       },
  { key: 'study',           label: 'Etiqueta “formação”'       },
  { key: 'journeyEndKind',  label: 'Fecho da trajetória: etiqueta'  },
  { key: 'journeyEndTitle', label: 'Fecho da trajetória: título'    },
  { key: 'journeyEndDesc',  label: 'Fecho da trajetória: texto'     },
  { key: 'journeyEndLink',  label: 'Fecho da trajetória: link'      },
  { key: 'seeAllTitle',     label: 'Cartão “ver tudo”: título'      },
  { key: 'seeAllDesc',      label: 'Cartão “ver tudo”: texto'       },
  { key: 'seeAll',          label: 'Cartão “ver tudo”: ação'        },
  { key: 'skills',          label: 'Título do bloco de skills'      },
  { key: 'languages',       label: 'Título do bloco de idiomas'     },
];

/** Texto padrão de um capítulo, no idioma pedido. */
export function chapterDefault(key, lang = 'pt') {
  return (NARRATIVE[lang] || NARRATIVE.pt).chapters[key] || {};
}
