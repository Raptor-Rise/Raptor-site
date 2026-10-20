(function () {
  "use strict";

  var config = window.RAPTOR_CONFIG || {};
  var whatsapp = config.whatsapp || {};
  var social = config.social || {};
  var root = document.body ? document.body.dataset.root || "" : "";

  var whatsappNumber = String(whatsapp.number || "").replace(/\D+/g, "");
  var whatsappMessage = String(whatsapp.message || "").trim();
  var whatsappUrl = whatsappNumber
    ? "https://wa.me/" + whatsappNumber + (whatsappMessage ? "?text=" + encodeURIComponent(whatsappMessage) : "")
    : null;

  var email = String(config.email || "").trim();
  var emailUrl = email ? "mailto:" + email : null;

  function setLinkAvailability(link, available) {
    link.hidden = !available;
    var item = link.closest("li");
    if (item) item.hidden = !available;
  }

  /* Contact links --------------------------------------------------------- */

  document.querySelectorAll("[data-whatsapp]").forEach(function (link) {
    if (whatsappUrl) {
      link.href = whatsappUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      // Sem número configurado, o link volta para a seção de contato da home.
      link.href = link.dataset.waFallback || "#contato";
    }
  });

  document.querySelectorAll("[data-email-link]").forEach(function (link) {
    if (!emailUrl) {
      setLinkAvailability(link, false);
      return;
    }
    link.href = emailUrl;
    setLinkAvailability(link, true);
  });

  document.querySelectorAll("[data-email-text]").forEach(function (node) {
    if (email) node.textContent = email;
  });

  document.querySelectorAll("[data-social]").forEach(function (link) {
    var url = String(social[link.dataset.social] || "").trim();
    if (!url) {
      setLinkAvailability(link, false);
      return;
    }
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    setLinkAvailability(link, true);
  });

  var contactCta = document.querySelector("[data-contact-cta]");
  var contactNote = document.getElementById("contact-note");

  if (contactCta && !whatsappUrl) {
    contactCta.addEventListener("click", function (event) {
      event.preventDefault();
      if (!contactNote) return;
      contactNote.hidden = false;
      contactNote.focus();
    });
  }

  /* Logos de parceiros ---------------------------------------------------- */

  var partnerLogos = config.partnerLogos || {};

  document.querySelectorAll("[data-partner]").forEach(function (item) {
    var entry = partnerLogos[item.dataset.partner] || {};
    if (!entry.authorized || !entry.src) return;

    var label = item.querySelector(".partner__name");
    var img = document.createElement("img");

    img.src = root + entry.src;
    img.alt = label ? label.textContent.trim() : "";
    img.loading = "lazy";
    img.decoding = "async";

    item.insertBefore(img, item.firstChild);
    if (label) label.hidden = true;
  });

  /* Outros projetos ------------------------------------------------------- */

  var projectNav = document.querySelector("[data-project-nav]");
  var projectList = window.RAPTOR_PROJECTS;

  if (projectNav && Array.isArray(projectList)) {
    var current = document.body.dataset.project;
    var arrow =
      '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    projectNav.innerHTML = projectList
      .filter(function (project) {
        return project.slug !== current;
      })
      .map(function (project) {
        return (
          '<a class="next-card" href="' + root + project.url + '">' +
            '<span class="next-card__media"><img src="' + root + project.thumb + '" alt="' + project.thumbAlt + '" loading="lazy" decoding="async"></span>' +
            '<span class="next-card__body">' +
              '<span class="next-card__cat">' + project.category + "</span>" +
              '<span class="next-card__name">' + project.name + "</span>" +
              '<span class="next-card__more">Conhecer projeto ' + arrow + "</span>" +
            "</span>" +
          "</a>"
        );
      })
      .join("");
  }

  /* Header state ---------------------------------------------------------- */

  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  var mobileQuery = window.matchMedia("(max-width: 920px)");
  var menuOpen = false;

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  if (header) {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function setMenu(open, restoreFocus) {
    if (!header || !toggle) return;

    if (!mobileQuery.matches) open = false;
    menuOpen = open;

    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("menu-open", open);

    if (open) {
      var firstLink = nav ? nav.querySelector("a") : null;
      if (firstLink) window.requestAnimationFrame(function () { firstLink.focus(); });
    } else if (restoreFocus) {
      toggle.focus();
    }
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!menuOpen, false);
    });
  }

  if (nav) {
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a") && mobileQuery.matches) setMenu(false, false);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuOpen) {
      setMenu(false, true);
      return;
    }

    if (event.key !== "Tab" || !menuOpen || !header) return;

    var focusables = Array.prototype.filter.call(
      header.querySelectorAll("a[href], button:not([disabled])"),
      function (el) {
        return el.getClientRects().length > 0 && !el.hidden;
      }
    );

    if (!focusables.length) return;

    var first = focusables[0];
    var last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  var onBreakpointChange = function () {
    if (!mobileQuery.matches && menuOpen) setMenu(false, false);
  };

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", onBreakpointChange);
  } else if (typeof mobileQuery.addListener === "function") {
    mobileQuery.addListener(onBreakpointChange);
  }

  /* Active section (home) ------------------------------------------------- */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));

  function setActiveSection(id) {
    navLinks.forEach(function (link) {
      if (link.getAttribute("href") === "#" + id) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  var isCasePage = Boolean(document.body.dataset.project);

  if (!isCasePage && "IntersectionObserver" in window && sections.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* Galeria ampliada ------------------------------------------------------ */

  (function initLightbox() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-gallery]"));
    if (!triggers.length || typeof HTMLDialogElement === "undefined") return;

    var dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.setAttribute("aria-label", "Visualização ampliada da imagem");
    dialog.innerHTML =
      '<div class="lightbox__inner">' +
        '<div class="lightbox__bar">' +
          '<p class="lightbox__counter" data-lightbox-counter aria-live="polite"></p>' +
          '<button class="lightbox__close" type="button" data-lightbox-close aria-label="Fechar visualização">' +
            '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' +
          "</button>" +
        "</div>" +
        '<figure class="lightbox__figure">' +
          '<img alt="">' +
          "<figcaption data-lightbox-caption></figcaption>" +
        "</figure>" +
        '<div class="lightbox__controls">' +
          '<button class="lightbox__nav" type="button" data-lightbox-prev aria-label="Imagem anterior">' +
            '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3 5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "</button>" +
          '<button class="lightbox__nav" type="button" data-lightbox-next aria-label="Próxima imagem">' +
            '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          "</button>" +
        "</div>" +
      "</div>";

    document.body.appendChild(dialog);

    var image = dialog.querySelector("img");
    var caption = dialog.querySelector("[data-lightbox-caption]");
    var counter = dialog.querySelector("[data-lightbox-counter]");
    var items = [];
    var index = 0;
    var opener = null;
    var previousOverflow = "";

    function render() {
      var item = items[index];
      if (!item) return;

      image.src = item.dataset.full || item.querySelector("img").currentSrc;
      image.alt = item.dataset.alt || "";
      caption.textContent = item.dataset.caption || "";
      counter.textContent = index + 1 + " / " + items.length;
    }

    function step(delta) {
      if (items.length < 2) return;
      index = (index + delta + items.length) % items.length;
      render();
    }

    function open(trigger) {
      var group = trigger.dataset.gallery;
      items = triggers.filter(function (item) {
        return item.dataset.gallery === group;
      });
      index = Math.max(0, items.indexOf(trigger));
      opener = trigger;

      dialog.classList.toggle("is-single", items.length < 2);
      render();

      if (!dialog.open) dialog.showModal();

      previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
    }

    triggers.forEach(function (trigger) {
      trigger.setAttribute("aria-haspopup", "dialog");
      trigger.addEventListener("click", function () {
        open(trigger);
      });
    });

    dialog.querySelector("[data-lightbox-close]").addEventListener("click", function () {
      dialog.close();
    });

    dialog.querySelector("[data-lightbox-prev]").addEventListener("click", function () {
      step(-1);
    });

    dialog.querySelector("[data-lightbox-next]").addEventListener("click", function () {
      step(1);
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        index = 0;
        render();
      } else if (event.key === "End") {
        event.preventDefault();
        index = items.length - 1;
        render();
      }
    });

    dialog.addEventListener("close", function () {
      document.documentElement.style.overflow = previousOverflow;
      if (opener) opener.focus();
    });
  })();

  /* Year ------------------------------------------------------------------ */

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });
})();
