/**
 * Configuração central da Raptor.
 *
 * Preencha os campos marcados como PENDENTE antes de publicar.
 * Os links de WhatsApp, e-mail e redes sociais são gerados a partir daqui.
 */
window.RAPTOR_CONFIG = {
  whatsapp: {
    // PENDENTE: número comercial no formato internacional, apenas dígitos.
    // Exemplo: "5511999999999" (55 + DDD + número).
    number: "",
    message: "Olá! Vim pelo site da Raptor e gostaria de conversar sobre um projeto.",
  },

  // PENDENTE: e-mail comercial. Exemplo: "contato@seudominio.com.br".
  email: "",

  social: {
    // PENDENTE: URLs completas dos perfis oficiais.
    linkedin: "",
    instagram: "",
    github: "",
  },

  /**
   * Logos de empresas e parceiros.
   *
   * A divulgação pública depende de autorização de cada empresa.
   * Enquanto "authorized" for false, a faixa de parceiros exibe apenas
   * o nome em texto e o arquivo da logo não é carregado.
   */
  partnerLogos: {
    legacy: { authorized: false, src: "projects/legacy/logo-legacy.svg" },
    omni: { authorized: false, src: "projects/omni-co/logo-omni.png" },
    realfor: { authorized: false, src: "projects/realfor/logo-realfor.png" },
  },
};
