/* ============================================================================
   Crave for Cake — behaviour
   Everything on screen is built from js/data.js. You should not need to edit
   this file to change content.
   ========================================================================== */
(function () {
  "use strict";

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  /* ------------------------------------------------------------- helpers */

  function money(value, unit) {
    const note = unit ? `<small>${esc(unit)}</small>` : "";
    if (!value || Number(value) === 0) {
      return `<span class="price__ask">Price on request</span>${note}`;
    }
    return `${SITE.currency} ${Number(value).toLocaleString("en-US")}${note}`;
  }

  /* ------------------------------------------------------ email delivery
     Orders and messages are emailed through Web3Forms, which is built for
     static sites like this one. Set SITE.formAccessKey in data.js to switch
     it on; with no key both forms fall back to handing the details to
     WhatsApp, so nothing is ever silently lost. */

  function emailEnabled() {
    const k = String(SITE.formAccessKey || "").trim();
    return k.length > 8 && k.toLowerCase().indexOf("paste") === -1;
  }

  function sendToEmail(subject, fields) {
    const payload = Object.assign({
      access_key: String(SITE.formAccessKey).trim(),
      subject: subject,
      from_name: SITE.brand.name
    }, fields);

    return fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    }).then((res) => res.json().catch(() => ({})).then((data) => {
      if (!res.ok || !data.success) {
        throw new Error(data.message || "the message could not be sent");
      }
      return data;
    }));
  }

  function busy(btn, on, workingLabel) {
    if (!btn) return;
    if (on) {
      btn.dataset.label = btn.textContent;
      btn.textContent = workingLabel;
      btn.disabled = true;
    } else {
      btn.textContent = btn.dataset.label || btn.textContent;
      btn.disabled = false;
    }
  }

  function waLink(message) {
    return `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(message)}`;
  }

  function productById(id) {
    return SITE.products.find((p) => p.id === id);
  }

  function categoryName(id) {
    const c = SITE.categories.find((c) => c.id === id);
    return c ? c.name : id;
  }

  /* --------------------------------------------------------------- icons */
  const ICON = {
    logo: `<svg class="brand__mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M8 33h24v-5.5c0-1.7-1.4-3-3.1-3H11.1C9.4 24.5 8 25.8 8 27.5V33Z" stroke="currentColor" stroke-width="1.6"/>
      <path d="M11 24.5v-4.9c0-1.7 1.4-3.1 3.1-3.1h11.8c1.7 0 3.1 1.4 3.1 3.1v4.9" stroke="currentColor" stroke-width="1.6"/>
      <path d="M11 20c1.7 0 1.7 2 3.4 2s1.7-2 3.4-2 1.7 2 3.4 2 1.7-2 3.4-2 1.7 2 3.4 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M8 28.5c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M20 15.5V11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M20 11c-1.4-1-1.4-2.6 0-3.9 1.4 1.3 1.4 2.9 0 3.9Z" stroke="currentColor" stroke-width="1.4"/>
    </svg>`,
    wa: `<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z"/><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.13h-.01c-1.5 0-2.98-.4-4.27-1.17l-.31-.18-3.17.83.85-3.09-.2-.32a8.2 8.2 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.69 8.24-8.24 8.24Z"/></svg>`,
    ig: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5.2"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>`,
    phone: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6.6 3.5h3l1.5 3.7-2 1.4a11.6 11.6 0 0 0 5.3 5.3l1.4-2 3.7 1.5v3c0 .9-.8 1.7-1.7 1.6C10.2 17.4 6.6 13.8 5 6.2c-.1-1.4.4-2.7 1.6-2.7Z"/></svg>`,
    mail: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3.8 7 7.3 5.2c.5.4 1.3.4 1.8 0L20.2 7"/></svg>`,
    pin: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>`,
    note: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6 3.5h9.5L19 7v13.5H6z"/><path d="M15 3.5V7h4"/><path d="M9 12h7M9 16h5"/></svg>`,
    clock: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.2V12l3 1.8"/></svg>`,
    zoom: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4M11 8.6v4.8M8.6 11h4.8"/></svg>`,
    close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
    prev: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M14.5 5 8 12l6.5 7"/></svg>`,
    next: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M9.5 5 16 12l-6.5 7"/></svg>`
  };

  /* ------------------------------------------------------- nav + footer */

  const NAV_ITEMS = [
    { label: "Home",     href: "index.html" },
    { label: "Menu",     href: "menu.html" },
    { label: "Gallery",  href: "gallery.html" },
    { label: "About Us", href: "about.html" },
    { label: "Reviews",  href: "index.html#reviews" },
    { label: "Contact",  href: "contact.html" }
  ];

  function currentPage() {
    const f = location.pathname.split("/").pop();
    return f === "" ? "index.html" : f;
  }

  function buildNav() {
    const host = $("#site-nav");
    if (!host) return;
    const page = currentPage();
    const active = (href) => (href.indexOf("#") === -1 && href === page ? " class=\"is-active\"" : "");

    host.innerHTML = `
      <nav class="nav" id="topnav" aria-label="Main">
        <div class="nav__inner">
          <a class="brand" href="index.html" aria-label="${esc(SITE.brand.name)} — home">
            <img class="brand__logo" src="${esc(SITE.brand.logo)}" alt="" width="500" height="500">
            <span class="brand__words">
              <span class="brand__name">${esc(SITE.brand.name)}</span>
              <span class="brand__sub">${esc(SITE.brand.sub)}</span>
            </span>
          </a>
          <ul class="nav__links">
            ${NAV_ITEMS.map((i) => `<li><a href="${i.href}"${active(i.href)}>${esc(i.label)}</a></li>`).join("")}
            <li><a class="btn btn--sm" href="order.html">Order Now</a></li>
          </ul>
          <button class="nav__toggle" id="navToggle" aria-expanded="false" aria-controls="drawer" aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
      <div class="drawer" id="drawer">
        ${NAV_ITEMS.map((i) => `<a href="${i.href}">${esc(i.label)}</a>`).join("")}
        <a class="btn btn--block" href="order.html">Order Now</a>
        <div class="drawer__foot">${esc(SITE.brand.tagline)}</div>
      </div>`;

    const nav = $("#topnav"), toggle = $("#navToggle"), drawer = $("#drawer");

    const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    function setDrawer(open) {
      drawer.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("no-scroll", open);
      if (open) {
        $$("a", drawer).forEach((a, i) => (a.style.transitionDelay = 60 + i * 45 + "ms"));
      } else {
        $$("a", drawer).forEach((a) => (a.style.transitionDelay = "0ms"));
      }
    }
    toggle.addEventListener("click", () => setDrawer(!drawer.classList.contains("is-open")));
    $$("a", drawer).forEach((a) => a.addEventListener("click", () => setDrawer(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setDrawer(false); });
  }

  function buildFooter() {
    const host = $("#site-footer");
    if (!host) return;
    const c = SITE.contact;
    // the espresso CTA band already carries a scallop above it; only add one
    // here when the page ends on a light section.
    const prev = host.previousElementSibling;
    const needsScallop = !(prev && prev.classList && prev.classList.contains("cta-band"));

    host.innerHTML = `
      ${needsScallop ? '<div class="scallop scallop--espresso" aria-hidden="true"></div>' : ""}
      <footer class="footer">
        <div class="wrap">
          <div class="footer__grid">
            <div>
              <a class="brand brand--footer" href="index.html">
                <img class="brand__badge" src="${esc(SITE.brand.logo)}" alt="${esc(SITE.brand.name)}" width="1200" height="1200">
              </a>
              <p class="footer__tag">${esc(SITE.brand.footerLine)}</p>
              <p class="footer__note">${esc(SITE.brand.tagline)}. Fresh cakes, brownies and cupcakes, baked to order.</p>
              <div class="socials">
                <a class="social" href="${esc(c.instagramUrl)}" target="_blank" rel="noopener" aria-label="Instagram">${ICON.ig}</a>
                <a class="social" href="${waLink(`Hi ${SITE.brand.name}! I'd like to ask about an order.`)}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICON.wa}</a>
              </div>
            </div>
            <div>
              <h4>Explore</h4>
              <ul class="footer__links">
                ${NAV_ITEMS.filter((i) => i.label !== "Reviews").map((i) => `<li><a href="${i.href}">${esc(i.label)}</a></li>`).join("")}
                <li><a href="order.html">Order Now</a></li>
              </ul>
            </div>
            <div>
              <h4>Get in touch</h4>
              <ul class="footer__links">
                <li><a href="https://wa.me/${esc(c.whatsapp)}" target="_blank" rel="noopener">WhatsApp ${esc(c.whatsappDisplay)}</a></li>
                <li><a href="tel:+${esc(c.phone)}">${esc(c.phoneDisplay)}</a></li>
                <li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>
                <li><a href="${esc(c.instagramUrl)}" target="_blank" rel="noopener">${esc(c.instagramHandle)}</a></li>
              </ul>
            </div>
          </div>
          <div class="footer__bar">
            <span>${esc(SITE.brand.copyright)}</span>
            <span>${esc(SITE.brand.footerNote)}</span>
          </div>
        </div>
      </footer>`;
  }

  function buildWhatsAppButton() {
    if ($(".wa-float")) return;
    const a = document.createElement("a");
    a.className = "wa-float";
    a.href = waLink(`Hi ${SITE.brand.name}! I'd like to place an order.`);
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "Chat with us on WhatsApp");
    a.innerHTML = `${ICON.wa}<span class="wa-float__label">Order on WhatsApp</span>`;
    document.body.appendChild(a);
  }

  /* ------------------------------------------------------- scroll reveal */

  function initReveal() {
    const items = $$("[data-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach((el) => io.observe(el));
  }

  function stagger(container, step) {
    $$("[data-reveal]", container).forEach((el, i) => {
      el.style.setProperty("--d", (i * (step || 70)) + "ms");
    });
  }

  /* ----------------------------------------------------- render: cards */

  function productCardHTML(p) {
    return `
      <article class="card" data-reveal data-category="${esc(p.category)}">
        <div class="card__media">
          <span class="card__tag">${esc(categoryName(p.category))}</span>
          <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" width="800" height="800">
          <button class="card__peek" type="button" data-product="${esc(p.id)}">View details</button>
        </div>
        <div class="card__body">
          <h3 class="card__title">${esc(p.name)}</h3>
          <p class="card__text">${esc(p.short)}</p>
          <div class="card__foot">
            <span class="price">${money(p.price, p.unit)}</span>
            <button class="btn btn--sm" type="button" data-product="${esc(p.id)}">Order Now</button>
          </div>
        </div>
      </article>`;
  }

  /* the "1 pound prices / customised charges differ" line from the menu card */
  /* the ordering rules, shown above the order form */
  function renderOrderTerms() {
    const host = $("#orderTerms");
    if (!host) return;
    const terms = SITE.contact.orderTerms || [];
    if (!terms.length) { host.remove(); return; }
    host.innerHTML = `
      <span class="eyebrow">Before you order</span>
      <ul class="terms">${terms.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
  }

  function renderMenuNote() {
    $$("#menuNote").forEach((el) => {
      if (!SITE.menuNote) { el.remove(); return; }
      el.innerHTML = `<span aria-hidden="true">✦</span> ${esc(SITE.menuNote)}`;
    });
  }

  /* home page: the slow-moving strip of recent photographs */
  function renderPhotoStrip() {
    const host = $("#photoStrip");
    if (!host) return;
    const pics = SITE.gallery.slice(0, 10).map((g) => g);
    if (!pics.length) { host.closest(".strip-section").remove(); return; }
    const run = pics.concat(pics);          // doubled so the loop is seamless
    host.innerHTML = `<div class="strip__track">${run.map((g) => `
      <a class="strip__item" href="gallery.html" tabindex="-1">
        <img src="${esc(g.image)}" alt="${esc(g.caption)}" loading="lazy">
      </a>`).join("")}</div>`;
  }

  function renderBestSellers() {
    const host = $("#bestSellers");
    if (!host) return;
    const list = SITE.products.filter((p) => p.bestSeller);
    host.innerHTML = list.map(productCardHTML).join("");
    stagger(host);
  }

  function renderMenu() {
    const host = $("#menuGrid");
    if (!host) return;
    const filters = $("#menuFilters");
    if (filters) {
      filters.innerHTML =
        `<button class="filter is-active" type="button" data-filter="all">All</button>` +
        SITE.categories.map((c) => `<button class="filter" type="button" data-filter="${esc(c.id)}">${esc(c.name)}</button>`).join("");
    }

    function paint(cat) {
      const list = cat === "all" ? SITE.products : SITE.products.filter((p) => p.category === cat);
      host.classList.add("filtering");
      host.innerHTML = list.length
        ? list.map(productCardHTML).join("")
        : `<p class="empty-state">Nothing in this category yet. Add products to <code>js/data.js</code> to fill it.</p>`;
      $$("[data-reveal]", host).forEach((el) => el.classList.add("is-in"));
      stagger(host, 45);
    }

    paint("all");
    $$("[data-reveal]", host).forEach((el) => el.classList.remove("is-in"));
    initReveal();

    if (filters) {
      filters.addEventListener("click", (e) => {
        const b = e.target.closest(".filter");
        if (!b) return;
        $$(".filter", filters).forEach((f) => f.classList.toggle("is-active", f === b));
        paint(b.dataset.filter);
      });
    }

    // deep link: menu.html?category=brownies
    const wanted = new URLSearchParams(location.search).get("category");
    if (wanted && filters) {
      const btn = $(`.filter[data-filter="${CSS.escape(wanted)}"]`, filters);
      if (btn) btn.click();
    }
  }

  function renderFeatures() {
    const host = $("#features");
    if (!host) return;
    host.innerHTML = SITE.features.map((f) => `
      <article class="feature" data-reveal>
        <div class="feature__icon" aria-hidden="true">${f.icon}</div>
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.text)}</p>
      </article>`).join("");
    stagger(host, 90);
  }

  function renderOccasions() {
    const host = $("#occasions");
    if (!host) return;
    host.innerHTML = SITE.occasions.map((o) => `
      <a class="occ" href="menu.html" data-reveal>
        <img src="${esc(o.image)}" alt="${esc(o.title)} cakes" loading="lazy" width="800" height="1000">
        <span class="occ__grad"></span>
        <div class="occ__body">
          <h3>${esc(o.title)}</h3>
          <p>${esc(o.text)}</p>
        </div>
      </a>`).join("");
    stagger(host, 80);
  }

  function renderReviews() {
    const host = $("#reviews-grid");
    if (!host) return;
    const sample = SITE.reviewsAreSamples;
    const notice = $("#reviews-notice");
    if (notice) {
      notice.innerHTML = sample
        ? `<div class="notice"><span aria-hidden="true">✎</span><span><strong>Sample reviews.</strong> These are placeholders showing the layout. They are not from real customers — replace them in <code>js/data.js</code> and set <code>reviewsAreSamples: false</code>.</span></div>`
        : "";
    }
    const card = (r) => `
      <article class="review${sample ? " is-sample" : ""}" data-reveal>
        <div class="review__stars" aria-label="${r.rating} out of 5">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
        <p class="review__text">${esc(r.text)}</p>
        <div class="review__who">
          <span class="review__avatar" aria-hidden="true">${esc((r.name || "?").trim().charAt(0).toUpperCase())}</span>
          <span>
            <span class="review__name">${esc(r.name)}</span><br>
            <span class="review__meta">${esc(sample ? (r.meta || "Sample review") : (r.meta || ""))}</span>
          </span>
        </div>
      </article>`;

    /* show a first batch, then reveal the rest on request — with a lot of
       reviews the section would otherwise run very long */
    const limit = Number(SITE.reviewsOnHome) || SITE.reviews.length;
    const first = SITE.reviews.slice(0, limit);
    const rest = SITE.reviews.slice(limit);

    host.innerHTML = first.map(card).join("");
    stagger(host, 80);

    const more = $("#reviews-more");
    if (!more) return;
    if (!rest.length) { more.remove(); return; }

    more.innerHTML = `<button class="btn btn--ghost" type="button">Show all ${SITE.reviews.length} reviews</button>`;
    $("button", more).addEventListener("click", () => {
      host.insertAdjacentHTML("beforeend", rest.map(card).join(""));
      stagger(host, 60);
      initReveal();
      more.remove();
    });
  }

  function renderInstagram() {
    const host = $("#igGrid");
    if (!host) return;
    host.innerHTML = SITE.instagram.map((src) => `
      <a class="ig" href="${esc(SITE.contact.instagramUrl)}" target="_blank" rel="noopener" data-reveal aria-label="View on Instagram">
        <img src="${esc(src)}" alt="Instagram post" loading="lazy" width="600" height="600">
        <span class="ig__icon">${ICON.ig}</span>
      </a>`).join("");
    stagger(host, 50);
  }

  /* --------------------------------------------------------- gallery */

  const GALLERY_TABS = [
    { id: "all",      label: "All" },
    { id: "cakes",    label: "Cakes" },
    { id: "brownies", label: "Brownies" },
    { id: "cupcakes", label: "Cupcakes" },
    { id: "custom",   label: "Custom Orders" }
  ];

  function renderGallery() {
    const host = $("#galleryGrid");
    if (!host) return;
    const tabs = $("#galleryFilters");
    let shown = SITE.gallery.slice();

    if (tabs) {
      tabs.innerHTML = GALLERY_TABS.map((t, i) =>
        `<button class="filter${i === 0 ? " is-active" : ""}" type="button" data-filter="${t.id}">${esc(t.label)}</button>`).join("");
    }

    function paint(cat) {
      shown = cat === "all" ? SITE.gallery.slice() : SITE.gallery.filter((g) => g.category === cat);
      host.classList.add("filtering");
      host.innerHTML = shown.map((g, i) => `
        <button class="masonry__item" type="button" data-index="${i}" aria-label="Open image ${i + 1}">
          <img src="${esc(g.image)}" alt="${esc(g.caption)}" loading="lazy">
          <span class="masonry__zoom">${ICON.zoom}</span>
        </button>`).join("");
    }
    paint("all");

    if (tabs) {
      tabs.addEventListener("click", (e) => {
        const b = e.target.closest(".filter");
        if (!b) return;
        $$(".filter", tabs).forEach((f) => f.classList.toggle("is-active", f === b));
        paint(b.dataset.filter);
      });
    }

    /* lightbox */
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Image preview");
    lb.innerHTML = `
      <button class="lightbox__close" type="button" aria-label="Close preview">${ICON.close}</button>
      <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous image">${ICON.prev}</button>
      <img src="" alt="">
      <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next image">${ICON.next}</button>
      <div class="lightbox__count"></div>`;
    document.body.appendChild(lb);

    const lbImg = $("img", lb), lbCount = $(".lightbox__count", lb);
    let index = 0;

    function show(i) {
      if (!shown.length) return;
      index = (i + shown.length) % shown.length;
      lbImg.src = shown[index].image;
      lbImg.alt = shown[index].caption || "Gallery image";
      lbCount.textContent = `${index + 1} / ${shown.length}`;
    }
    function open(i) { show(i); lb.classList.add("is-open"); document.body.classList.add("no-scroll"); }
    function close() { lb.classList.remove("is-open"); document.body.classList.remove("no-scroll"); }

    host.addEventListener("click", (e) => {
      const b = e.target.closest(".masonry__item");
      if (b) open(Number(b.dataset.index));
    });
    $(".lightbox__close", lb).addEventListener("click", close);
    $(".lightbox__nav--prev", lb).addEventListener("click", () => show(index - 1));
    $(".lightbox__nav--next", lb).addEventListener("click", () => show(index + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }

  /* ------------------------------------------------- product details modal */

  let modal, lastFocus;

  function buildModal() {
    if (modal) return;
    modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "productModal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
      <div class="modal__scrim" data-close></div>
      <div class="modal__panel">
        <button class="modal__close" type="button" data-close aria-label="Close">${ICON.close}</button>
        <div class="pd" id="pdContent"></div>
      </div>`;
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    if (lastFocus) lastFocus.focus();
  }

  function openProduct(id) {
    const p = productById(id);
    if (!p) return;
    buildModal();
    lastFocus = document.activeElement;

    const sizes = (p.sizes || []);
    const flavors = (p.flavors || []);

    $("#pdContent", modal).innerHTML = `
      <div class="pd__media">
        <img src="${esc(p.image)}" alt="${esc(p.name)}" width="800" height="800">
      </div>
      <div class="pd__body">
        <span class="eyebrow">${esc(categoryName(p.category))}</span>
        <h2 id="pdTitle">${esc(p.name)}</h2>
        <div class="pd__price price">${money(p.price, p.unit)}</div>
        <p class="pd__desc">${esc(p.description)}</p>

        ${sizes.length ? `<div class="field">
          <span class="label">Size</span>
          <div class="chips" data-group="size">
            ${sizes.map((s, i) => `<button class="chip${i === 0 ? " is-active" : ""}" type="button" data-value="${esc(s)}">${esc(s)}</button>`).join("")}
          </div>
        </div>` : ""}

        ${flavors.length ? `<div class="field">
          <span class="label">Flavour</span>
          <div class="chips" data-group="flavor">
            ${flavors.map((f, i) => `<button class="chip${i === 0 ? " is-active" : ""}" type="button" data-value="${esc(f)}">${esc(f)}</button>`).join("")}
          </div>
        </div>` : ""}

        <div class="field">
          <span class="label">Quantity</span>
          <div class="qty">
            <button type="button" data-step="-1" aria-label="Decrease quantity">−</button>
            <input id="pdQty" type="number" value="1" min="1" max="99" aria-label="Quantity">
            <button type="button" data-step="1" aria-label="Increase quantity">+</button>
          </div>
        </div>

        ${p.custom ? `
        <div class="field">
          <label for="pdDesign">Preferred design</label>
          <input id="pdDesign" type="text" placeholder="Colours, style, finish">
        </div>
        <div class="field">
          <label for="pdTheme">Theme</label>
          <input id="pdTheme" type="text" placeholder="e.g. floral, minimal, cartoon-free elegant">
        </div>` : ""}

        <div class="field">
          <label for="pdMessage">Message on cake</label>
          <input id="pdMessage" type="text" placeholder="Happy Birthday Ayesha">
        </div>

        <div class="field">
          <label for="pdNotes">Anything else</label>
          <textarea id="pdNotes" placeholder="Allergies, delivery date, special requests"></textarea>
        </div>

        <div class="pd__actions">
          <a class="btn btn--wa" id="pdWa" href="#" target="_blank" rel="noopener">${ICON.wa} Order on WhatsApp</a>
          <a class="btn btn--ghost" id="pdForm" href="order.html">Use the order form</a>
        </div>
        <p class="form-note">Prices shown are placeholders until the real menu is added.</p>
      </div>`;

    modal.setAttribute("aria-labelledby", "pdTitle");

    const panel = $(".modal__panel", modal);
    panel.scrollTop = 0;

    // chips
    $$(".chips", modal).forEach((group) => {
      group.addEventListener("click", (e) => {
        const c = e.target.closest(".chip");
        if (!c) return;
        $$(".chip", group).forEach((x) => x.classList.toggle("is-active", x === c));
        refreshLinks();
      });
    });

    // qty stepper
    const qty = $("#pdQty", modal);
    $$("[data-step]", modal).forEach((b) => b.addEventListener("click", () => {
      const next = Math.min(99, Math.max(1, Number(qty.value || 1) + Number(b.dataset.step)));
      qty.value = next;
      refreshLinks();
    }));
    $$("input, textarea", modal).forEach((el) => el.addEventListener("input", refreshLinks));

    function chosen(group) {
      const el = $(`.chips[data-group="${group}"] .chip.is-active`, modal);
      return el ? el.dataset.value : "";
    }

    function refreshLinks() {
      const data = {
        product: p.name,
        size: chosen("size"),
        flavor: chosen("flavor"),
        qty: qty.value || 1,
        design: $("#pdDesign", modal) ? $("#pdDesign", modal).value : "",
        theme: $("#pdTheme", modal) ? $("#pdTheme", modal).value : "",
        message: $("#pdMessage", modal).value,
        notes: $("#pdNotes", modal).value
      };
      const lines = [
        `Hi ${SITE.brand.name}! I'd like to order:`,
        "",
        `Product: ${data.product}`,
        data.size ? `Size: ${data.size}` : "",
        data.flavor ? `Flavour: ${data.flavor}` : "",
        `Quantity: ${data.qty}`,
        data.design ? `Design: ${data.design}` : "",
        data.theme ? `Theme: ${data.theme}` : "",
        data.message ? `Message on cake: ${data.message}` : "",
        data.notes ? `Notes: ${data.notes}` : ""
      ].filter(Boolean);
      $("#pdWa", modal).href = waLink(lines.join("\n"));

      const params = new URLSearchParams();
      Object.keys(data).forEach((k) => { if (data[k]) params.set(k, data[k]); });
      $("#pdForm", modal).href = "order.html?" + params.toString();
    }
    refreshLinks();

    modal.classList.add("is-open");
    document.body.classList.add("no-scroll");
    $(".modal__close", modal).focus();
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-product]");
    if (t) { e.preventDefault(); openProduct(t.dataset.product); }
  });

  /* ------------------------------------------------------------ order page */

  function initOrderForm() {
    const form = $("#orderForm");
    if (!form) return;

    // populate selects from data.js
    const productSel = $("#f-product", form);
    productSel.innerHTML =
      `<option value="">Choose a product</option>` +
      SITE.categories.map((c) => `<optgroup label="${esc(c.name)}">` +
        SITE.products.filter((p) => p.category === c.id)
          .map((p) => `<option value="${esc(p.name)}">${esc(p.name)}</option>`).join("") +
        `</optgroup>`).join("") +
      `<option value="Something else">Something else (describe below)</option>`;

    $("#f-flavor", form).innerHTML = `<option value="">Choose a flavour</option>` +
      ORDER_OPTIONS.flavors.map((f) => `<option value="${esc(f)}">${esc(f)}</option>`).join("");
    $("#f-size", form).innerHTML = `<option value="">Choose a size</option>` +
      ORDER_OPTIONS.sizes.map((s) => `<option value="${esc(s)}">${esc(s)}</option>`).join("");

    // no past dates
    const dateEl = $("#f-date", form);
    dateEl.min = new Date().toISOString().split("T")[0];

    // prefill from the product popup
    const q = new URLSearchParams(location.search);
    const setIf = (sel, val) => { if (val) { const el = $(sel, form); if (el) el.value = val; } };
    setIf("#f-product", q.get("product"));
    setIf("#f-flavor", q.get("flavor"));
    setIf("#f-size", q.get("size"));
    setIf("#f-qty", q.get("qty"));
    setIf("#f-design", q.get("design") || q.get("theme"));
    setIf("#f-message", q.get("message"));
    setIf("#f-notes", q.get("notes"));

    function values() {
      return {
        "Name": $("#f-name", form).value.trim(),
        "Phone": $("#f-phone", form).value.trim(),
        "WhatsApp": $("#f-wa", form).value.trim(),
        "Product": $("#f-product", form).value,
        "Quantity": $("#f-qty", form).value,
        "Flavour": $("#f-flavor", form).value,
        "Size": $("#f-size", form).value,
        "Design": $("#f-design", form).value.trim(),
        "Message on cake": $("#f-message", form).value.trim(),
        "Delivery address": $("#f-address", form).value.trim(),
        "Delivery date": $("#f-date", form).value,
        "Notes": $("#f-notes", form).value.trim()
      };
    }

    function required(v) {
      const missing = [];
      if (!v["Name"]) missing.push("your name");
      if (!v["Phone"] && !v["WhatsApp"]) missing.push("a phone or WhatsApp number");
      if (!v["Product"]) missing.push("a product");
      return missing;
    }

    function status(kind, html) {
      const box = $("#orderStatus", form);
      box.className = "form-status is-visible form-status--" + kind;
      box.innerHTML = html;
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function summary(v) {
      return [`New order for ${SITE.brand.name}`, ""]
        .concat(Object.keys(v).filter((k) => v[k]).map((k) => `${k}: ${v[k]}`))
        .join("\n");
    }

    /* ------------------------------------------------- the order email
       Web3Forms prints one row per field, in the order they are sent, and
       prints the empty ones too. So the mail is only as readable as what
       we hand it: a few grouped lines, nothing blank, and the things that
       matter first — what was ordered, when it is needed, who to call. */

    function niceDate(iso) {
      if (!iso) return "";
      const d = new Date(iso + "T00:00:00");
      if (isNaN(d)) return iso;
      return d.toLocaleDateString("en-GB",
        { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    }

    function orderLine(v) {
      const qty = Number(v["Quantity"]) > 1 ? ` × ${v["Quantity"]}` : "";
      const extras = [v["Flavour"], v["Size"]].filter(Boolean).join(", ");
      return v["Product"] + qty + (extras ? ` — ${extras}` : "");
    }

    function emailFields(v) {
      const wa = v["WhatsApp"] && v["WhatsApp"] !== v["Phone"]
        ? `${v["WhatsApp"]} (WhatsApp)` : "";
      const rows = {
        "Order": orderLine(v),
        "Needed by": niceDate(v["Delivery date"]),
        "Customer": v["Name"],
        "Reach them on": [v["Phone"], wa].filter(Boolean).join("  ·  "),
        "Deliver to": v["Delivery address"],
        "Writing on the cake": v["Message on cake"],
        "Design": v["Design"],
        "Notes": v["Notes"]
      };
      Object.keys(rows).forEach((k) => { if (!rows[k]) delete rows[k]; });
      return rows;
    }

    function emailSubject(v) {
      /* short enough to read in a phone notification */
      const qty = Number(v["Quantity"]) > 1 ? ` × ${v["Quantity"]}` : "";
      const when = niceDate(v["Delivery date"]).replace(/,? \d{4}$/, "");
      return ["New order · " + v["Product"] + qty, v["Name"], when ? "for " + when : ""]
        .filter(Boolean).join("  ·  ");
    }

    /* ------------------------------------------------- reference photos
       The order itself travels by email, and a photo cannot ride along
       with it. What we can do is open a chat that already says which
       order the photo belongs to, so the customer only has to attach it. */

    function photoLink(v) {
      const what = [v["Name"], v["Product"] && `for the ${v["Product"].toLowerCase()}`]
        .filter(Boolean).join(" ");
      return waLink(`Hi ${SITE.brand.name}! This is ${what} — here is the design I have in mind.`);
    }

    function photoButton(v) {
      return `<a class="btn btn--wa btn--sm" href="${photoLink(v)}" target="_blank" rel="noopener">Send a reference photo</a>`;
    }

    $("#orderWa", form).addEventListener("click", () => {
      const v = values(), missing = required(v);
      if (missing.length) {
        status("err", `Add ${missing.join(", ")} before sending on WhatsApp.`);
        return;
      }
      window.open(waLink(summary(v)), "_blank", "noopener");
      status("ok", "Your order details opened in WhatsApp. Send the message to confirm, " +
        "and attach your reference photos to that same chat.");
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = values(), missing = required(v);
      if (missing.length) {
        status("err", `Add ${missing.join(", ")} to place the order.`);
        return;
      }
      /* no email key set yet — hand the order to WhatsApp instead */
      if (!emailEnabled()) {
        status("ok",
          `<strong>Almost there.</strong> Tap the button below and your order — already filled in — opens in WhatsApp. Press send there to confirm it.<br><br>` +
          `<a class="btn btn--wa btn--sm" href="${waLink(summary(v))}" target="_blank" rel="noopener">Send it on WhatsApp</a>`);
        return;
      }

      const btn = $("#orderSubmit", form);
      busy(btn, true, "Sending…");
      status("ok", "Sending your order…");

      sendToEmail(emailSubject(v), emailFields(v))
        .then(() => {
          form.reset();
          status("ok",
            `<strong>Thank you, ${esc(v["Name"])}.</strong> Your order has reached us. ` +
            `We'll confirm the details and the price with you shortly.<br><br>` +
            `Have a photo of the design you want? Send it over on WhatsApp — ` +
            `it is the easiest way to show us.<br><br>` + photoButton(v));
        })
        .catch((err) => {
          status("err",
            `Sorry — your order didn't go through (${esc(err.message)}). ` +
            `Please send it on WhatsApp instead, nothing you typed is lost.<br><br>` +
            `<a class="btn btn--wa btn--sm" href="${waLink(summary(v))}" target="_blank" rel="noopener">Send it on WhatsApp</a>`);
        })
        .then(() => busy(btn, false));
    });
  }

  /* ---------------------------------------------------------- contact page */

  function initContactPage() {
    const host = $("#contactInfo");
    if (!host) return;
    const c = SITE.contact;

    host.innerHTML = `
      <a class="info" href="https://wa.me/${esc(c.whatsapp)}" target="_blank" rel="noopener">
        <span class="info__icon">${ICON.wa}</span>
        <span><span class="info__label">WhatsApp</span><span class="info__value">${esc(c.whatsappDisplay)}</span></span>
      </a>
      <a class="info" href="tel:+${esc(c.phone)}">
        <span class="info__icon">${ICON.phone}</span>
        <span><span class="info__label">Phone</span><span class="info__value">${esc(c.phoneDisplay)}</span></span>
      </a>
      <a class="info" href="mailto:${esc(c.email)}">
        <span class="info__icon">${ICON.mail}</span>
        <span><span class="info__label">Email</span><span class="info__value">${esc(c.email)}</span></span>
      </a>
      <a class="info" href="${esc(c.instagramUrl)}" target="_blank" rel="noopener">
        <span class="info__icon">${ICON.ig}</span>
        <span><span class="info__label">Instagram</span><span class="info__value">${esc(c.instagramHandle)}</span></span>
      </a>
      <div class="info">
        <span class="info__icon">${ICON.pin}</span>
        <span>
          <span class="info__label">Delivery areas</span>
          <span class="info__value" style="margin-bottom:.6rem;display:block">${esc(c.deliveryNote)}</span>
          <span class="pills">${c.deliveryAreas.map((a) => `<span class="pill">${esc(a)}</span>`).join("")}</span>
        </span>
      </div>
      <div class="info">
        <span class="info__icon">${ICON.note}</span>
        <span style="flex:1">
          <span class="info__label">How ordering works</span>
          <ul class="terms">${(c.orderTerms || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        </span>
      </div>
      <div class="info">
        <span class="info__icon">${ICON.clock}</span>
        <span style="flex:1">
          <span class="info__label">Business hours</span>
          <ul class="hours" style="margin-top:.6rem">
            ${c.hours.map((h) => `<li><span>${esc(h.days)}</span><span>${esc(h.time)}</span></li>`).join("")}
          </ul>
        </span>
      </div>`;

    const form = $("#contactForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#c-name", form).value.trim();
      const msg = $("#c-message", form).value.trim();
      const box = $("#contactStatus", form);
      if (!name || !msg) {
        box.className = "form-status is-visible form-status--err";
        box.textContent = "Add your name and a message so we know how to help.";
        return;
      }
      const email = $("#c-email", form).value.trim();
      const text = [`Hi ${SITE.brand.name}!`, "", `From: ${name}`,
        `Email: ${email}`, "", msg].filter(Boolean).join("\n");

      const show = (kind, html) => {
        box.className = "form-status is-visible form-status--" + kind;
        box.innerHTML = html;
      };

      if (!emailEnabled()) {
        show("ok", `<strong>Thanks, ${esc(name)}.</strong> Send the same message on WhatsApp and we'll reply there.<br><br>
          <a class="btn btn--wa btn--sm" href="${waLink(text)}" target="_blank" rel="noopener">Send on WhatsApp</a>`);
        return;
      }

      const btn = $("#contactSubmit", form);
      busy(btn, true, "Sending…");
      show("ok", "Sending your message…");

      const fields = { "Message": msg, "From": name };
      if (email) { fields["Email"] = email; fields.replyto = email; }

      sendToEmail("Message · " + name, fields)
        .then(() => {
          form.reset();
          show("ok", `<strong>Thanks, ${esc(name)}.</strong> Your message has reached us and we'll reply as soon as we can.`);
        })
        .catch((err) => {
          show("err", `Sorry — your message didn't go through (${esc(err.message)}). Please send it on WhatsApp instead.<br><br>
            <a class="btn btn--wa btn--sm" href="${waLink(text)}" target="_blank" rel="noopener">Send on WhatsApp</a>`);
        })
        .then(() => busy(btn, false));
    });
  }

  /* -------------------------------------------------------------- about */

  function renderAbout() {
    const host = $("#aboutBody");
    if (!host) return;
    const a = SITE.about;
    host.innerHTML = `
      <span class="eyebrow">${esc(a.eyebrow)}</span>
      <h2>${esc(a.heading)}</h2>
      <div class="rule"></div>
      ${a.body.map((p) => `<p>${esc(p)}</p>`).join("")}
      <div class="about-points">
        ${a.points.map((p) => `
          <div class="about-point">
            <span class="about-point__dot"></span>
            <div>
              <h4>${esc(p.title)}</h4>
              <p>${esc(p.text)}</p>
            </div>
          </div>`).join("")}
      </div>`;
    const img = $("#aboutImage");
    if (img) img.src = SITE.aboutImage;
  }

  /* ---------------------------------------------------------------- boot */

  function fillStaticText() {
    document.title = document.title.replace("{{brand}}", SITE.brand.name);
    $$("[data-text]").forEach((el) => {
      const path = el.dataset.text.split(".");
      let v = SITE;
      path.forEach((k) => { v = v ? v[k] : ""; });
      if (typeof v === "string") el.textContent = v;
    });
    const heroImg = $("#heroImage");
    if (heroImg) heroImg.src = SITE.hero.image;
    const banner = $("#menuBanner");
    if (banner) banner.src = SITE.menuBanner;
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildNav();
    buildFooter();
    buildWhatsAppButton();
    fillStaticText();

    renderMenuNote();
    renderOrderTerms();
    renderPhotoStrip();
    renderBestSellers();
    renderFeatures();
    renderOccasions();
    renderReviews();
    renderInstagram();
    renderMenu();
    renderGallery();
    renderAbout();
    initOrderForm();
    initContactPage();

    initReveal();
  });
})();
