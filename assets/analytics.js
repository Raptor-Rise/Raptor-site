(function () {
  "use strict";

  var config = (window.RAPTOR_CONFIG && window.RAPTOR_CONFIG.analytics) || {};
  var measurementId = String(config.measurementId || "").trim().toUpperCase();
  var storageKey = String(config.consentStorageKey || "raptor_analytics_consent_v1");
  var validMeasurementId = /^G-[A-Z0-9]+$/.test(measurementId);
  var loaded = false;
  var consent = null;
  var banner = null;

  if (!validMeasurementId) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  // Estado mais restritivo antes de qualquer carregamento externo.
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });

  function readConsent() {
    try {
      var value = window.localStorage.getItem(storageKey);
      return value === "granted" || value === "denied" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function storeConsent(value) {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch (error) {
      // O consentimento ainda vale para a página atual quando o armazenamento
      // local estiver indisponível, mas será solicitado novamente na próxima.
    }
  }

  function updateConsent(value) {
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: value,
    });
  }

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;

    updateConsent("granted");
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: window.location.origin + window.location.pathname,
      page_title: document.title,
    });

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    script.referrerPolicy = "strict-origin-when-cross-origin";
    document.head.appendChild(script);
  }

  function clearAnalyticsCookies() {
    var cookieNames = document.cookie
      .split(";")
      .map(function (entry) { return entry.split("=")[0].trim(); })
      .filter(function (name) {
        return name === "_ga" || name.indexOf("_ga_") === 0 || name === "_gid" || name.indexOf("_gat") === 0;
      });

    var hostParts = window.location.hostname.split(".");
    var domains = [""];

    for (var index = 0; index < hostParts.length - 1; index += 1) {
      domains.push("." + hostParts.slice(index).join("."));
    }

    cookieNames.forEach(function (name) {
      domains.forEach(function (domain) {
        document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax" + (domain ? "; domain=" + domain : "");
      });
    });
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  function setConsent(value) {
    var wasLoaded = loaded;
    consent = value;
    storeConsent(value);
    hideBanner();

    if (value === "granted") {
      loadAnalytics();
      return;
    }

    updateConsent("denied");
    clearAnalyticsCookies();

    // Se a tag já estava ativa, o reload a remove completamente da página e
    // garante que nenhuma medição sem cookies continue após a revogação.
    if (wasLoaded) window.location.reload();
  }

  function createBanner() {
    var root = document.body ? document.body.dataset.root || "" : "";
    var element = document.createElement("section");
    element.className = "cookie-consent";
    element.setAttribute("role", "region");
    element.setAttribute("aria-labelledby", "cookie-consent-title");
    element.hidden = true;
    element.innerHTML =
      '<div class="cookie-consent__content">' +
        '<div class="cookie-consent__copy">' +
          '<p class="cookie-consent__eyebrow">Privacidade</p>' +
          '<h2 id="cookie-consent-title">Cookies analíticos</h2>' +
          '<p>Com sua autorização, usamos o Google Analytics para entender visitas e interações e melhorar este site. A recusa não limita a navegação.</p>' +
          '<a href="' + root + 'privacidade.html">Saiba como os dados são utilizados</a>' +
        '</div>' +
        '<div class="cookie-consent__actions">' +
          '<button class="btn btn--primary" type="button" data-cookie-accept>Aceitar analíticos</button>' +
          '<button class="btn btn--secondary" type="button" data-cookie-reject>Rejeitar</button>' +
        '</div>' +
      '</div>';

    element.querySelector("[data-cookie-accept]").addEventListener("click", function () {
      setConsent("granted");
    });
    element.querySelector("[data-cookie-reject]").addEventListener("click", function () {
      setConsent("denied");
    });

    document.body.appendChild(element);
    return element;
  }

  function showBanner(restoreFocus) {
    if (!banner) banner = createBanner();
    banner.hidden = false;

    if (restoreFocus) {
      var preferredButton = banner.querySelector(consent === "granted" ? "[data-cookie-reject]" : "[data-cookie-accept]");
      if (preferredButton) preferredButton.focus();
    }
  }

  function pageContext() {
    return document.body.dataset.project || (window.location.pathname.indexOf("privacidade") !== -1 ? "privacy" : "home");
  }

  function linkContext(link) {
    if (link.closest(".site-header")) return "header";
    if (link.closest(".contact")) return "contact_section";
    if (link.closest(".footer")) return "footer";
    if (link.closest(".hero")) return "hero";
    return "content";
  }

  function projectId(link) {
    var href = link.getAttribute("href") || "";
    var match = href.match(/projetos\/([^/?#]+)/);
    return match ? match[1] : "unknown";
  }

  function track(name, parameters) {
    if (consent !== "granted" || !loaded) return;
    window.gtag("event", name, parameters || {});
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("a, button");
    if (!target) return;

    if (target.matches("[data-cookie-settings]")) {
      event.preventDefault();
      showBanner(true);
      return;
    }

    if (target.matches("[data-whatsapp]")) {
      track("contact_click", {
        contact_method: "whatsapp",
        link_context: linkContext(target),
        page_context: pageContext(),
      });
      return;
    }

    if (target.matches("[data-email-link]")) {
      track("contact_click", {
        contact_method: "email",
        link_context: linkContext(target),
        page_context: pageContext(),
      });
      return;
    }

    if (target.matches(".project-card, .next-card")) {
      track("select_content", {
        content_type: "project",
        item_id: projectId(target),
        link_context: target.matches(".project-card") ? "featured_projects" : "other_projects",
      });
      return;
    }

    if (target.matches("[data-gallery]")) {
      track("gallery_open", {
        gallery_id: target.dataset.gallery || "unknown",
        project_id: pageContext(),
      });
    }
  });

  document.querySelectorAll("[data-cookie-settings]").forEach(function (button) {
    button.hidden = false;
  });

  consent = readConsent();

  if (consent === "granted") {
    loadAnalytics();
  } else if (consent === "denied") {
    updateConsent("denied");
  } else {
    showBanner(false);
  }
})();
