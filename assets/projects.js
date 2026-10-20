/**
 * Dados compartilhados entre as páginas de projeto.
 *
 * Usado apenas para montar a navegação "Outros projetos" no fim de cada case.
 * O conteúdo editorial de cada case permanece em HTML, indexável.
 * Ao adicionar um projeto, inclua uma entrada aqui e a página correspondente.
 */
window.RAPTOR_PROJECTS = [
  {
    slug: "acervo-digital",
    name: "Acervo Digital",
    category: "Plataforma de Conteúdos Digitais",
    url: "projetos/acervo-digital/",
    thumb: "projects/legacy/acervo-digital/home-thumb.webp",
    thumbAlt: "Tela inicial do Acervo Digital, com a listagem de materiais digitais.",
  },
  {
    slug: "central-de-midias",
    name: "Central de Mídias",
    category: "Gestão de Mídias e Design",
    url: "projetos/central-de-midias/",
    thumb: "projects/omni-co/central-midias/home-thumb.webp",
    thumbAlt: "Tela inicial da Central de Mídias, com os materiais de mídia organizados.",
  },
  {
    slug: "realfor-tax",
    name: "Realfor-Tax",
    category: "Tecnologia Tributária",
    url: "projetos/realfor-tax/",
    thumb: "projects/realfor/realfor-tax/image-thumb.webp",
    thumbAlt: "Tela de criação de projeto do Realfor-Tax.",
  },
];
