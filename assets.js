/* KI Construction Materials Importer — shared script for all pages.
   Built by Velora Software. Loaded once, cached by the browser across the site.

   - Mobile menu toggle
   - EN / አማርኛ language switch (choice stored in localStorage: "ki_lang")
   - Footer year stamp

   English text lives in each page's HTML. Amharic strings live in I18N.am below.
   Any element with data-i18n / data-i18n-html / data-i18n-aria / data-i18n-title
   is swapped on language change. Missing Amharic keys fall back to the English markup.
   The Amharic copy is machine-generated and still needs a native-speaker proof-read
   (see amharic-review.md).
*/
(function () {
  "use strict";

  /* ---------- mobile menu ---------- */
  var btn = document.getElementById("menuBtn");
  var mnav = document.getElementById("mnav");
  if (btn && mnav) {
    function setMenu(open) {
      mnav.classList.toggle("open", open);
      document.documentElement.classList.toggle("menu-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    btn.addEventListener("click", function () {
      setMenu(!mnav.classList.contains("open"));
    });
    mnav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mnav.classList.contains("open")) {
        setMenu(false);
        btn.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (!mnav.contains(e.target) && !btn.contains(e.target)) setMenu(false);
    });
    document.addEventListener("focusin", function (e) {
      if (!mnav.contains(e.target) && !btn.contains(e.target)) setMenu(false);
    });
    var desktopNav = window.matchMedia("(min-width: 1040px)");
    desktopNav.addEventListener("change", function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------- home hero: fixed headline, photos slide in one after another ---------- */
  (function () {
    var slides = document.querySelectorAll(".hero-slide");
    if (!slides.length) return;
    var hero = document.querySelector(".hero");

    var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // The first image is real HTML, visible without JavaScript and discoverable
    // by the preload scanner. Later slides keep their URLs in data attributes
    // so they cannot compete with the LCP image during the initial load.
    var ready = [Promise.resolve()];
    function startLoading(idx) {
      if (ready[idx]) return ready[idx];
      var img = slides[idx].querySelector("img");
      if (!img) return Promise.resolve();

      ready[idx] = new Promise(function (resolve) {
        var settled = false;
        function done() {
          if (settled) return;
          settled = true;
          if (img.decode) img.decode().then(resolve, resolve);
          else resolve();
          setTimeout(resolve, 1500); // decode() can stall in a background tab — never let it block the slider
        }
        img.onload = done;
        img.onerror = done;
        var srcset = img.getAttribute("data-srcset");
        var src = img.getAttribute("data-src");
        if (srcset) img.srcset = srcset;
        if (src) img.src = src;
        img.removeAttribute("data-srcset");
        img.removeAttribute("data-src");
        setTimeout(done, 4000);
      });
      return ready[idx];
    }

    var HOLD_MS = 5000;
    var SLIDE_MS = 900;
    var i = 0, busy = false, timer = null;

    // dot indicators — one per photo; clicking jumps straight to that photo
    var dots = [];
    if (hero && slides.length > 1) {
      var nav = document.createElement("div");
      nav.className = "hero-dots";
      for (var d = 0; d < slides.length; d++) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Show photo " + (d + 1) + " of " + slides.length);
        b.addEventListener("click", (function (idx) { return function () { go(idx); }; })(d));
        nav.appendChild(b);
        dots.push(b);
      }
      hero.appendChild(nav);
    }
    function markDot(idx) {
      for (var k = 0; k < dots.length; k++) {
        dots[k].classList.toggle("is-active", k === idx);
        if (k === idx) dots[k].setAttribute("aria-current", "true");
        else dots[k].removeAttribute("aria-current");
      }
    }

    function show(el, x) {
      el.style.transition = "none";
      el.style.display = "block";
      el.style.opacity = "1";
      el.style.transform = "translate3d(" + x + "%,0,0)";
    }

    show(slides[0], 0);
    slides[0].style.zIndex = "1";
    slides[0].classList.add("is-active");
    markDot(0);

    // incoming photo slides in from the right while the current one slides out to the left
    function slideTo(nextIdx) {
      if (busy || nextIdx === i) return Promise.resolve();
      busy = true;
      return startLoading(nextIdx).then(function () {
        return new Promise(function (resolve) {
          var incoming = slides[nextIdx];
          var outgoing = slides[i];
          markDot(nextIdx);

          function finish() {
            clearTimeout(fallback);
            outgoing.style.display = "none";
            outgoing.style.transition = "none";
            outgoing.classList.remove("is-active");
            incoming.style.transition = "none";
            incoming.style.transform = "translate3d(0,0,0)";
            incoming.style.zIndex = "1";
            incoming.classList.add("is-active");
            i = nextIdx;
            busy = false;
            resolve();
          }

          if (reduceMotion) {
            show(incoming, 0);
            var fallback = null;
            finish();
            return;
          }

          show(incoming, 100);
          incoming.style.zIndex = "2";
          var fallback = setTimeout(finish, SLIDE_MS + 400);
          void incoming.offsetWidth; // commit the off-screen start position before animating
          var t = "transform " + SLIDE_MS + "ms cubic-bezier(.65,0,.35,1)";
          incoming.style.transition = t;
          outgoing.style.transition = t;
          incoming.style.transform = "translate3d(0,0,0)";
          outgoing.style.transform = "translate3d(-100%,0,0)";
        });
      });
    }

    function schedule() {
      clearTimeout(timer);
      if (reduceMotion) return;
      timer = setTimeout(function () {
        slideTo((i + 1) % slides.length).then(schedule);
      }, HOLD_MS);
    }
    function go(idx) {
      if (busy) return;
      clearTimeout(timer);
      slideTo(idx).then(schedule);
    }

    // pause while the tab is hidden so photos don't pile up in the background
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) clearTimeout(timer);
      else schedule();
    });

    schedule();
  })();

  /* ---------- animated stat counters (home page): count up from 0 the first time they're scrolled into view ---------- */
  (function () {
    var nums = document.querySelectorAll(".stats .stat .n");
    if (!nums.length) return;
    if (!("IntersectionObserver" in window)) return;
    var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    function animateCount(el) {
      var text = el.textContent.trim();
      var match = text.match(/^(\d+)(.*)$/);
      if (!match) return;
      var target = parseInt(match[1], 10);
      var suffix = match[2];
      if (!target) return;
      var duration = 1200;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.classList.add("sweep");
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (reduceMotion) { /* leave the static number as-is */ }
          else animateCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    nums.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- scroll reveal (all pages): fade + slide up the first time an element enters the viewport ---------- */
  (function () {
    if (!("IntersectionObserver" in window)) return;
    var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (reduceMotion) return;

    document.documentElement.classList.add("reveal-ready");

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    function colCount(grid) {
      var cols = getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length;
      return cols || 1;
    }
    function revealGroup(containerSel, itemSel, stepMs, extraClass) {
      document.querySelectorAll(containerSel).forEach(function (container) {
        var items = container.querySelectorAll(itemSel);
        if (!items.length) return;
        var cols = colCount(container);
        items.forEach(function (el, i) {
          el.classList.add("reveal");
          if (extraClass) el.classList.add(extraClass);
          el.style.transitionDelay = ((i % cols) * stepMs) + "ms";
          io.observe(el);
        });
      });
    }
    function revealEach(sel, extraClass) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add("reveal");
        if (extraClass) el.classList.add(extraClass);
        io.observe(el);
      });
    }

    revealEach(".brands");                           // home: brand strip — one block, no stagger
    revealGroup(".stats-band .stats", ":scope > *", 80); // home: stat counter band
    revealGroup(".cards", ".card", 100, "reveal-pop");        // home + products.html: product-range cards
    revealGroup(".value-grid", ".value-card", 80, "reveal-pop"); // home: Why KI + Who We Serve icon cards
    revealGroup(".range-gal", "figure", 70, "reveal-pop");   // product pages: "other items in this range" thumbnail cards
    revealGroup(".gal", "figure", 70);                // home's field strip + achievements' cert/exhibition galleries
    revealGroup(".quotes", "blockquote", 100);       // home + achievements: testimonials
    revealGroup(".logos", "div", 60);                // home + achievements: customer logos
    revealGroup(".vm", ".box", 100);                 // about: vision / mission boxes
    revealGroup(".team", "div", 70);                 // about's org chart + achievements' who-we-serve list
    revealGroup(".photos", "figure", 40);            // achievements: masonry exhibition photos
    revealGroup(".contact-grid", ":scope > *", 100); // contact: info column + map card

    revealEach(".sec-head");                         // home: the 6 eyebrow+heading+intro blocks above each card grid
    revealEach(".cta-band .wrap");                   // every page: the bottom "need a quote?" heading + buttons
    revealEach(".prod-detail > .media", "reveal-left");  // the 5 product pages: large hero photo slides in from its own (left) side
    revealEach(".about-media", "reveal-right");      // about: Kedir's photo slides in from its own (right) side

    document.querySelectorAll(".scan-line").forEach(function (el) { io.observe(el); }); // section dividers
  })();

  /* ---------- i18n ---------- */
  var I18N = { am: {
    /* nav / chrome */
    "brand.sub": "ማቴሪያል አስመጪ",
    "nav.aria": "ዋና ማውጫ",
    "nav.home": "መነሻ",
    "nav.products": "ምርቶች",
    "nav.about": "ስለ እኛ",
    "nav.achievements": "ስኬቶች",
    "nav.contact": "አግኙን",
    "btn.callNow": "አሁን ይደውሉ",
    "menu.aria": "ማውጫ ክፈት",
    "call.aria": "ወደ KI ይደውሉ",
    "mnav.call": "ይደውሉ",
    "topbar.tag": "ብቸኛ ወኪል · Power Trader Co. (ደቡብ ኮሪያ)",
    "cat.all": "ሁሉም ምርቶች",
    "cat.gensets": "ጄነሬተሮችና የኃይል መሣሪያ",
    "cat.breakers": "ሃይድሮሊክ ብሬከሮች",
    "cat.pumps": "ፓምፖችና የፀሐይ ፓምፖች",
    "cat.machinery": "የግንባታ ማሽነሪ",
    "cat.electro": "ኤሌክትሮ-ሜካኒካል",

    /* home hero */
    "hero.eyebrow": "የተመሠረተው በ2006 ዓ.ም · አዲስ አበባ",
    "hero.h1": "የግንባታና የኢንዱስትሪ ማሽነሪ — <span class=\"hl\">ወደ ኢትዮጵያ አስመጥተን በመላ አገሪቱ እናደርሳለን</span>",
    "hero.viewProducts": "ምርቶችን ይመልከቱ",
    "hero.slogan": "“ጥራት ቅድሚያ ነው፣ የደንበኛ እርካታ ፍላጎታችን ነው”",
    "hero.lead": "KI Construction Materials Importer ለተቋራጮች፣ ለኢንዱስትሪው እና ለመንግሥት ተቋማት ጄነሬተሮች፣ ሃይድሮሊክ ብሬከሮች፣ ፓምፖች፣ የግንባታ ማሽነሪ እና ኤሌክትሮ-ሜካኒካል ምርቶችን ያቀርባል። በኢትዮጵያ ውስጥ የ Power Trader Co. (ደቡብ ኮሪያ) ብቸኛ ወኪል።",
    "hero.badge1": "<span class=\"dot\">●</span><b>23 ዓመት</b> የመሥራቹ የዘርፍ ልምድ",
    "hero.badge2": "<span class=\"dot\">●</span><b>150+</b> ፕሮጀክቶች አቅርቦት",
    "hero.badge3": "<span class=\"dot\">●</span><b>ማስመጣት · ወደ ውጭ መላክ · ስርጭት</b>",
    "hero.chip": "<b>በመላ አገሪቱ</b> አቅርቦት እና የድህረ-ሽያጭ ድጋፍ",

    "brands.label": "ብራንዶች እና አጋርነቶች",
    "brands.pt": "ብቸኛ<br>ወኪል · ኢትዮጵያ",

    "stats.n1": "13 ዓመት",
    "stats.n2": "23 ዓመት",
    "stats.l1": "የኩባንያው ዕድሜ",
    "stats.l2": "የዘርፍ ልምድ",
    "stats.l3": "ትላልቅ ፕሮጀክቶች አቅርቦት",
    "stats.l4": "የምርት ዘርፎች",

    /* products (shared card copy, used on home + products.html) */
    "prod.eyebrow": "የምናቀርበው",
    "prod.h2": "ለግንባታ፣ ለኢንዱስትሪ እና ለግብርና የሚሆኑ አምስት ዋና የምርት ዘርፎች",
    "prod.intro": "እያንዳንዱ ዘርፍ በቴክኒክ ምክር፣ በተከላ እና በድህረ-ሽያጭ ድጋፍ የተደገፈ ነው። ለዝርዝር መግለጫ፣ ለአቅርቦት እና ለዋጋ ማቅረቢያ ያግኙን።",
    "products.lead": "አምስት ዋና የምርት ዘርፎች — እያንዳንዳቸው በቴክኒክ ምክር፣ በተከላ እና በድህረ-ሽያጭ አገልግሎት የተደገፉ። ዝርዝር ለማየት ማንኛውንም ዘርፍ ይጫኑ።",
    "card.more": "ዝርዝሩን ይመልከቱ",
    "home.prodLink": "ሁሉንም ምርቶች ይመልከቱ",
    "home.storyLink": "ታሪካችንን ያንብቡ",
    "home.trackLink": "የሥራ ታሪካችንን ይመልከቱ",

    "p1.title": "ጄነሬተሮችና የኃይል መሣሪያዎች",
    "p1.desc": "የ Perkins፣ Cummins እና Güçbir ዲዘል ጄነሬተሮች፣ ከ20–250 kVA፣ ጸጥ ያለ ወይም ክፍት ዓይነት — ለጭነትዎ በሚመጥን መጠን፣ በአካባቢው በሚገኝ መለዋወጫ የተደገፈ።",
    "p1.li1": "አልተርኔተሮች፣ ATS እና መቆጣጠሪያ ፓነሎች",
    "p1.li2": "ሙሉ የተከላ እና የማስጀመር አገልግሎት",
    "p1.li3": "መለዋወጫዎች በአገር ውስጥ በቀላሉ ይገኛሉ",

    "p2.tag": "ብቸኛ ወኪል",
    "p2.title": "ሃይድሮሊክ ብሬከሮችና ተጨማሪ መሣሪያዎች",
    "p2.desc": "Power Trader Co.፣ ደቡብ ኮሪያ — አስተማማኝ አፈጻጸም፣ ረጅም ዕድሜ እና ዝቅተኛ የጥገና ወጪ ያላቸው ሃይድሮሊክ ብሬከሮች።",
    "p2.li1": "ለሁሉም የኤክስካቫተር መጠን የሚሆኑ ብሬከሮች",
    "p2.li2": "ቺዝሎች፣ ሞይሎች እና የጃክ-ሃመር መለዋወጫዎች",
    "p2.li3": "ፈጣን አገልግሎት እና የመለዋወጫ ድጋፍ",

    "p3.title": "ፓምፖችና የውኃ ማንሻ መፍትሔዎች",
    "p3.desc": "የላይኛ (surface)፣ ውኃ ውስጥ የሚሰምጥ (submersible)፣ ሴንትሪፉጋል እና በፀሐይ ኃይል የሚሠሩ ፓምፖች ከ1 HP እስከ 100 HP — ከቱርክ፣ ከጣሊያን፣ ከቻይና፣ ከሕንድ እና ከUAE የመጡ ብራንዶች።",
    "p3.li1": "ለጉድጓድ እና ለጥልቅ ውኃ የሚሆኑ submersible ፓምፖች",
    "p3.li2": "በፀሐይ ኃይል የሚሠሩ የፓምፕ ሲስተሞችና ኢንቨርተሮች",
    "p3.li3": "የመጠን ምርጫ፣ ተከላ እና ጥገና",

    "p4.title": "የግንባታ ማሽነሪ",
    "p4.desc": "SANY፣ XCMG እና SDLG ዊል ሎደሮች፣ ሮቢን ቫይብሬተሮች እና የጭነት መኪናዎች፣ እንዲሁም የ Honcha የብሎክ ማሽኖች — በመለዋወጫ እና በአገልግሎት ድጋፍ የተደገፉ።",
    "p4.li1": "ሮቢን ቫይብሬተሮች፣ ታምፒንግ ራመሮች፣ ፖከር ቫይብሬተሮች",
    "p4.li2": "የኮንክሪት ማቀላቀያዎች እና የ Honcha ብሎኬት ማሽኖች",
    "p4.li3": "ስክሪው እና ፒስተን የአየር ኮምፕረሰሮች፣ ሎደሮች",

    "p5.title": "ኤሌክትሮ-ሜካኒካል ማያያዣዎች",
    "p5.desc": "የ HDPE እና GI ቧንቧ ማያያዣዎች፣ የበር (gate)፣ የመቆጣጠሪያ እና የማረጋገጫ ቫልቮች፣ ፍላንጆች እና አስማሚዎች — ለውኃ፣ ለመስኖ እና ለኢንዱስትሪ መረቦች እንደ ፕሮጀክቱ ዝርዝር የሚቀርቡ።",
    "p5.li1": "የHDPE እና GI ቧንቧ ማያያዣዎች",
    "p5.li2": "ቫልቮች እና የመቆጣጠሪያ መለዋወጫዎች",
    "p5.li3": "የኢንዱስትሪ እና የግብርና ማያያዣዎች",

    /* why-KI band (home) */
    "why.eyebrow": "ለምን KI",
    "why.h2": "ሱቅ አይደለንም — የቴክኒክ ድጋፍ ያለው አስመጪ ነን",
    "why.1t": "ብቸኛ ውክልና",
    "why.1d": "በኢትዮጵያ የ Power Trader Co. (ደቡብ ኮሪያ) ሃይድሮሊክ ብሬከሮች ብቸኛ ወኪል።",
    "why.2t": "23 ዓመት ልምድ",
    "why.2d": "የመሥራቹ በግንባታ እና በኢንዱስትሪ ማሽነሪ ዘርፍ ያካበቱት ልምድ።",
    "why.3t": "በመላ አገሪቱ አቅርቦት",
    "why.3d": "በስትራቴጂክ መጋዘን የተደገፈ የስርጭት መረብ።",
    "why.4t": "የድህረ-ሽያጭ ድጋፍ",
    "why.4d": "ተከላ፣ ማስጀመር፣ መደበኛ ጥገና፣ መለዋወጫ እና የቴክኒክ ማማከር።",

    /* homepage expansion: who-we-serve grid, field/exhibition strip, testimonials */
    "serveHome.eyebrow": "የምናገለግላቸው",
    "serveHome.h2": "በመላ ኢትዮጵያ በተቋራጮች፣ በተቋማት እና በኢንዱስትሪ የታመንን",
    "serveHome.c1": "ተቋራጮች",
    "serveHome.c2": "መንግሥት እና መንግሥታዊ ያልሆኑ ድርጅቶች",
    "serveHome.c3": "የሪል እስቴት አልሚዎች",
    "serveHome.c4": "ፋብሪካዎች",
    "serveHome.c5": "ባንኮች",
    "serveHome.c6": "ሆስፒታሎች",
    "serveHome.c7": "ሆቴሎች",
    "serveHome.c8": "የገበያ ማዕከላት",

    "fieldStrip.eyebrow": "በሥራ ላይ",
    "fieldStrip.h2": "በሜዳ ላይ ከምርቶቻችን ጋር",

    "testimonials.eyebrow": "የደንበኞች አስተያየት",
    "testimonials.h2": "ደንበኞቻችን ስለ እኛ የሚሉት",

    /* CTA band (most pages) */
    "band.h": "የዋጋ ማቅረቢያ ወይም የቴክኒክ መልስ ይፈልጋሉ?",
    "band.p": "የሚፈልጉትን በመስመር ላይ ያስገቡ ወይም በቀጥታ ቡድናችንን ያግኙ።",

    /* shared spec labels (category pages) */
    "spec.range": "የምናቀርበው",
    "spec.brands": "ብራንዶች እና አጋሮች",
    "spec.apps": "የተለመዱ አጠቃቀሞች",
    "spec.other": "ሌሎች የምርት ዘርፎች",
    "spec.cta": "ስለዚህ ዘርፍ ይጠይቁን",
    "spec.rangeGal": "ከምርቶቻችን መካከል",
    "gs.g1": "የ Perkins ጸጥ ያለ ዲዘል ጄነሬተር (20–250 kVA)",
    "gs.g2": "ጸጥ ያለ ካኖፒ ያለው ዲዘል ጄነሬተር",
    "gs.g3": "ክፍት ዲዘል ጄነሬተር",
    "gs.g4": "ክፍት ጄነሬተሮች፣ የተለያዩ አቅሞች",
    "gs.g5": "ትናንሽ የቤንዚን እና ዲዘል ጄነሬተሮች",
    "gs.g6": "ATS እና መቆጣጠሪያ ፓነል",
    "gs.g7": "የኤሌክትሪክ ቁጥጥር እና ጥበቃ ፓነል",
    "gs.g8": "የ Perkins ጄነሬተር ከ ProPower መቆጣጠሪያ ፓነል ጋር",
    "gs.g9": "የ Perkins JP30 ጸጥ ያለ ዲዘል ጄነሬተር",
    "gs.g10": "የ Perkins–Stamford 33 kVA ክፍት ጄነሬተር",
    "hb.g1": "የ Power Trader ሃይድሮሊክ ብሬከሮች",
    "hb.g2": "የ Power Trader PB-ተከታታይ ብሬከር",
    "hb.g3": "የ Power Trader PB-ተከታታይ ጸጥ ያሉ ብሬከሮች",
    "pm.g1": "ሴንትሪፉጋል ፓምፖች",
    "pm.g2": "ለጉድጓድ የሚሆኑ submersible ፓምፖች",
    "pm.g3": "ባለብዙ ደረጃ ፓምፕ",
    "pm.g4": "የፀሐይ ፓምፕ ኢንቨርተር",
    "pm.g5": "ከማጠራቀሚያ ጋር የፀሐይ ፓምፕ ተከላ",
    "pm.g6": "በፀሐይ ኃይል የሚሠራ የጉድጓድ ውኃ ቦታ",
    "pm.g7": "የ Caprari ቁመታዊ መስመር ፓምፕ",
    "cm.g1": "ጭነት ማራገፊያ መኪናዎች",
    "cm.g2": "የኮንክሪት ማቀላቀያ (ጣሊያን)",
    "cm.g3": "ሮቢን ቫይብሬተር",
    "cm.g4": "ታምፒንግ ራመር",
    "cm.g5": "ዊል ሎደር",
    "cm.g6": "የኮንክሪት ማቀላቀያ መኪና",
    "cm.g7": "ኮንክሪት ፓምፕ በስራ ላይ",
    "cm.g8": "የ XCMG ሞባይል ክሬን በግንባታ ፕሮጀክት ላይ",

    /* ---- Generating sets page ---- */
    "gs.h1": "ጄነሬተሮችና የኃይል መሣሪያዎች",
    "gs.lead": "ከ20 kVA እስከ 250 kVA የሚደርሱ ዲዘል እና ጋዝ ጄነሬተሮች — ጸጥ ያለ እና ክፍት ዓይነት — ከአልተርኔተር፣ ከመቆጣጠሪያ ፓነል እና ከሙሉ ተከላ ጋር።",
    "gs.intro": "KI ለፋብሪካዎች፣ ለንግድ ሕንፃዎች፣ ለሆስፒታሎች፣ ለሆቴሎች፣ ለባንኮች እና ለግንባታ ቦታዎች የ Perkins፣ Cummins እና Güçbir ጄነሬተሮችን፣ እንዲሁም ለቀላል ጭነት የሚሆኑ ትናንሽ የቤንዚን እና ዲዘል ጄነሬተሮችን ያቀርባል። እያንዳንዱ ጄነሬተር ከጭነቱ ጋር ተመጣጥኖ በቴክኒክ ቡድናችን ተተክሎ ይጀመራል፤ መለዋወጫም በአገር ውስጥ ይያዛል።",
    "gs.r1": "የ Perkins ጸጥ ያለ እና ክፍት ዓይነት ዲዘል ጄነሬተሮች፣ 20–250 kVA",
    "gs.r2": "የ Cummins ክፍት ዲዘል ጄነሬተሮች",
    "gs.r3": "የ Güçbir ጄነሬተሮች",
    "gs.r4": "ትናንሽ የቤንዚን እና ዲዘል ጄነሬተሮች (Loncin፣ Blacksmith እና ተመሳሳይ)",
    "gs.r5": "አልተርኔተሮች፣ ATS እና መቆጣጠሪያ ፓነሎች",
    "gs.r6": "ሙሉ አቅርቦት፣ ተከላ፣ ማስጀመር እና ጥገና",
    "gs.a1": "ፋብሪካዎች እና የኢንዱስትሪ ተቋማት",
    "gs.a2": "የንግድ ሕንፃዎች፣ ሞሎች እና አፓርትመንቶች",
    "gs.a3": "ሆስፒታሎች፣ ሆቴሎች እና ባንኮች",
    "gs.a4": "የግንባታ ቦታዎች እና የተጠባባቂ ኃይል",

    /* ---- Hydraulic breakers page ---- */
    "hb.h1": "ሃይድሮሊክ ብሬከሮችና ተጨማሪ መሣሪያዎች",
    "hb.lead": "በኢትዮጵያ የ Power Trader Co. (ደቡብ ኮሪያ) ብቸኛ ወኪል በመሆን KI ለሁሉም የኤክስካቫተር መጠን የሚሆኑ ሃይድሮሊክ ብሬከሮችን ከቺዝል፣ ከመለዋወጫ እና ከፈጣን ድጋፍ ጋር ያቀርባል።",
    "hb.intro": "የ Power Trader ብሬከሮች ለተረጋገጠ አፈጻጸም፣ ለረጅም ዕድሜ እና ለዝቅተኛ የጥገና ወጪ የተሠሩ ናቸው። KI ከእያንዳንዱ ተሸካሚ ክብደት ጋር የሚመጥኑ ብሬከሮችን ይይዛል፣ የመልበሻ ክፍሎችንና ቺዝሎችን በክምችት ያቆያል፣ እያንዳንዱን ብሬከር በገበያው ፈጣኑ አገልግሎት ይደግፋል።",
    "hb.r1": "ለትንንሽ፣ ለመካከለኛ እና ለትላልቅ ኤክስካቫተሮች የሚሆኑ ሃይድሮሊክ ብሬከሮች",
    "hb.r2": "ቺዝሎች፣ ሞይል ፖይንቶች እና ደፍጣጣ መሣሪያዎች",
    "hb.r3": "የጃክ-ሃመር ቺዝሎችና መለዋወጫዎች",
    "hb.r4": "ስሩ-ቦልቶች፣ ማኅተሞች እና የመልበሻ ክፍሎች",
    "hb.r5": "በቦታው ላይ ተከላ እና የግፊት ማስተካከያ",
    "hb.r6": "የዋስትና ድጋፍ እና ፈጣን የመለዋወጫ አቅርቦት",
    "hb.a1": "የዐለት ቁፋሮ እና ትሬንች ሥራ",
    "hb.a2": "ፍርስራሽ እና የኮንክሪት ስብርባራ",
    "hb.a3": "የመንገድ እና የመሠረት ሥራዎች",
    "hb.a4": "የድንጋይ ማውጫ እና የማዕድን ቦታዎች",

    /* ---- Pumps page ---- */
    "pm.h1": "ፓምፖችና የፀሐይ ፓምፖች",
    "pm.lead": "የላይኛ፣ ውኃ ውስጥ የሚሰምጡ፣ ሴንትሪፉጋል እና በፀሐይ ኃይል የሚሠሩ ፓምፖች ከ1 HP እስከ 100 HP — ለውኃ አቅርቦት፣ ለመስኖ፣ ለሕንፃ እና ለኢንዱስትሪ።",
    "pm.intro": "KI ከቱርክ፣ ከጣሊያን፣ ከቻይና፣ ከሕንድ እና ከUAE የመጡ ፓምፖችን ለእያንዳንዱ ቦታ ከግፊት እና ከፍሰት ጋር አመጣጥኖ ያቀርባል። የፀሐይ ምድባችን ለከመስመር ውጭ ውኃ አቅርቦት እና ለመስኖ የሚሆኑ ፓነሎችን፣ ማስቀመጫ መዋቅሮችን፣ ኢንቨርተሮችን እና መቆጣጠሪያዎችን ያካትታል — እያደገ ያለ የሥራ ዘርፍ።",
    "pm.r1": "የላይኛ እና ቡስተር ፓምፖች",
    "pm.r2": "ለጉድጓድ እና ለጥልቅ ውኃ የሚሆኑ submersible ፓምፖች",
    "pm.r3": "ሴንትሪፉጋል እና ባለብዙ ደረጃ ፓምፖች",
    "pm.r4": "በፀሐይ ኃይል የሚሠሩ የፓምፕ ሲስተሞች፣ ኢንቨርተሮች እና መቆጣጠሪያዎች",
    "pm.r5": "ለፀሐይ ፓምፕ የሚሆኑ ፓነሎች እና ማስቀመጫ መዋቅሮች",
    "pm.r6": "የመጠን ምርጫ፣ ተከላ፣ ማስጀመር እና ጥገና",
    "pm.a1": "መስኖ እና ግብርና",
    "pm.a2": "የከተማ እና የገጠር ውኃ አቅርቦት",
    "pm.a3": "የሕንፃ ውኃ ሲስተሞችና ቡስቲንግ",
    "pm.a4": "የኢንዱስትሪ ሂደት ውኃ",

    /* ---- Construction machinery page ---- */
    "cm.h1": "የግንባታ ማሽነሪ",
    "cm.lead": "የኮንክሪት እና የማቴሪያል ማንቀሳቀሻ መሣሪያዎች — ከሮቢን ቫይብሬተር እስከ ዊል ሎደር እና የብሎኬት ማሽን።",
    "cm.intro": "KI አንድ ቦታ በየቀኑ የሚያስፈልገውን ማሽነሪ ያቀርባል፦ የመጠቅጠቅ እና የኮንክሪት መሣሪያ፣ የአየር ኮምፕረሰር፣ ሎደር እና የ Honcha ብሎኬት ማሽን — ከመለዋወጫ እና ከአገልግሎት ድጋፍ ጋር።",
    "cm.r1": "ሮቢን ቫይብሬተሮች እና ታምፒንግ ራመሮች",
    "cm.r2": "ፖከር/ኮንክሪት ቫይብሬተሮች እና የኮንክሪት ማቀላቀያዎች",
    "cm.r3": "የኮንክሪት ማቀላቀያ መኪናዎች እና ጭነት ማራገፊያ መኪናዎች",
    "cm.r4": "ዊል ሎደሮች",
    "cm.r5": "ስክሪው እና ፒስተን የአየር ኮምፕረሰሮች",
    "cm.r6": "የ Honcha የኮንክሪት ብሎኬት ማሽኖች",
    "cm.a1": "የሕንፃ እና የመንገድ ግንባታ",
    "cm.a2": "የኮንክሪት እና የብሎኬት ምርት",
    "cm.a3": "የመሬት ሥራ እና የማቴሪያል ማንቀሳቀስ",
    "cm.a4": "የቅድመ-ተቀረጻ እና የማምረቻ ቦታዎች",

    /* ---- Electromechanical page ---- */
    "em.h1": "ኤሌክትሮ-ሜካኒካል ማያያዣዎች",
    "em.lead": "የHDPE እና GI ቧንቧ ማያያዣዎች፣ ቫልቮች እና የመቆጣጠሪያ መለዋወጫዎች — ለውኃ አቅርቦት፣ ለመስኖ እና ለኢንዱስትሪ ተከላዎች።",
    "em.intro": "KI ፓምፕ ወይም ተቋም ከአውታረ መረቡ ጋር የሚያገናኙትን ቧንቧዎችና ማያያዣዎች ያቀርባል — የHDPE እና GI ማያያዣዎች፣ ቫልቮች እና የመቆጣጠሪያ መለዋወጫዎች — ለውኃ አቅርቦት ፕሮግራሞች፣ ለመስኖ ፕሮጀክቶች እና ለኢንዱስትሪ ተከላዎች።",
    "em.r1": "የHDPE ቧንቧ ማያያዣዎች እና ኮፕለሮች",
    "em.r2": "የGI ቧንቧ ማያያዣዎች",
    "em.r3": "ጌት፣ ቼክ እና መቆጣጠሪያ ቫልቮች",
    "em.r4": "ፍላንጆች፣ አዳፕተሮች እና መለዋወጫዎች",
    "em.r5": "ለኢንዱስትሪ እና ለግብርና አገልግሎት የሚሆኑ ማያያዣዎች",
    "em.r6": "እንደ ፕሮጀክቱ ዝርዝር መግለጫ አቅርቦት",
    "em.a1": "የውኃ አቅርቦት እና ስርጭት ፕሮግራሞች",
    "em.a2": "የመስኖ አውታሮች",
    "em.a3": "የኢንዱስትሪ የቧንቧ ተከላዎች",
    "em.a4": "የሕንፃ አገልግሎቶች",
    "em.galleryTitle": "የሚገኙ ማያያዣዎች፣ ቫልቮች እና መለዋወጫዎች",
    "em.g1": "ቫልቮች፣ ፍላንጆች እና የመቆጣጠሪያ መለዋወጫዎች",
    "em.g2": "ጌት ቫልቮች እና የመፍቻ ማያያዣዎች",
    "em.g3": "የHDPE ኮምፕሬሽን ማያያዣዎች እና ኮፕለሮች",
    "em.g4": "በተለያዩ ዲያሜትሮች የሚገኙ ቧንቧዎች",

    /* ---- About page ---- */
    "about.eyebrow": "እኛ ማን ነን",
    "about.h2": "የተመሠረተ አስመጪ ነን፣ ሱቅ አይደለንም",
    "about.lead": "KI Construction Materials Importer በ2006 ዓ.ም የተመሠረተ የግንባታ እና የኢንዱስትሪ ማሽነሪ አስመጪ፣ አከፋፋይ እና የቴክኒክ አገልግሎት ድርጅት ነው።",
    "about.p1": "KI Construction Materials Importer በ<b>2006 ዓ.ም</b> ተመሥርቶ የተመዘገበ ሲሆን፣ መሥራች እና ሥራ አስኪያጅ ዳይሬክተር <b>ኢንጂነር ከድር ኢብራሂም</b> በግንባታ እና በኢንዱስትሪ ማሽነሪ ዘርፍ — ጄነሬተሮች፣ የውኃ እና የፀሐይ ፓምፖች፣ የፀሐይ ኃይል እና ኤሌክትሮ-ሜካኒካል ሥራዎች — በሽያጭ እና በግብይት <b>23 ዓመት ልምድ</b> አላቸው።",
    "about.p2": "ዋናው ጽ/ቤት በአዲስ አበባ፣ አራዳ ክፍለ ከተማ፣ ወረዳ 01፣ ሳሙኤል ደረሳ ሕንፃ፣ ፒያሳ ይገኛል። KI በአንድ ቀላል መርሕ ላይ ጠንካራ እና ጤናማ የገበያ እምነት ገንብቷል፦ <i>“ጥራት ቅድሚያ ነው፣ የደንበኛ እርካታ ፍላጎታችን ነው።”</i>",
    "about.p3": "KI የግንባታ ማሽነሪ እና መለዋወጫ፣ ጄነሬተሮች፣ የውኃ እና የፀሐይ ፓምፖች፣ የቧንቧ ማያያዣዎች እና ኤሌክትሮ-ሜካኒካል ሥራዎች ግንባር ቀደም አስመጪ እና አከፋፋይ ነው። የሃይድሮሊክ ብሬከሮች እና ተጨማሪ መሣሪያዎች አምራች የሆነው የደቡብ ኮሪያው <b>Power Trader Co.</b> ብቸኛ ወኪል ነን፤ የምናቀርበውን እያንዳንዱን ምርት በቴክኒክ ምክር፣ በማማከር እና በድህረ-ሽያጭ አገልግሎት እንደግፋለን።",
    "about.visionLabel": "ራእይ",
    "about.visionText": "በሜካኒካል፣ በኤሌክትሪክ እና በሃርድዌር ንግድ ዘርፍ እጅግ ተመራጭ ኩባንያ ሆኖ መጠራት፣ እንዲሁም በኢትዮጵያ ጥራት ያለው የግንባታ ማቴሪያል እና ማሽነሪ ግንባር ቀደም አስመጪ እና አቅራቢ በመሆን — በአስተማማኝ ምርቶች እና በላቀ አገልግሎት የአገሪቱን የመሠረተ ልማት ዕድገት መደገፍ።",
    "about.missionLabel": "ተልእኮ",
    "about.missionText": "ምርቶቻችንን በትክክለኛው ጊዜ እና ቦታ፣ በጥራት ላይ ምንም ዓይነት ስምምነት ሳናደርግ ማቅረብ — ለኢትዮጵያ የግንባታ፣ የግብርና እና የኢንዱስትሪ ፕሮጀክቶች ዘላቂ እና ቀልጣፋ ማሽነሪ እና ማቴሪያል።",
    "about.obj1": "<b>የገበያ መሪነት</b> — በኢትዮጵያ ተወዳዳሪ የግንባታ ማቴሪያል ገበያ ውስጥ ጉልህ ድርሻ",
    "about.obj2": "<b>ደንበኛን ያማከለ አገልግሎት</b> — ከባለሙያ ምክር እና ፈጣን የድህረ-ሽያጭ ድጋፍ ጋር ጥራት ያላቸው ምርቶች",
    "about.obj3": "<b>ዕድገት</b> — የታዳሽ ኃይል መፍትሔዎችን ጨምሮ እያደገ የሚሄድ የምርት ስብስብ",
    "about.mgmtSubhead": "አመራር እና አደረጃጀት",
    "team.t1": "መሥራች እና ሥራ አስኪያጅ ዳይሬክተር",
    "about.figcap": "ኢንጂነር ከድር ኢብራሂም፣ መሥራች እና ሥራ አስኪያጅ ዳይሬክተር፣ በዓለም አቀፍ የማሽነሪ ኤግዚቢሽን ላይ።",

    /* ---- Achievements page ---- */
    "ach.eyebrow": "የሥራ ታሪክ",
    "ach.h2": "150+ ፕሮጀክቶች፣ ብቸኛ ውክልና እና ደጋግመው የሚመጡ ደንበኞች",
    "ach.lead": "ጥራት እና የደንበኛ እርካታ ላይ ያለን ጽናት KI በኢትዮጵያ ካሉ ታማኝ የንግድ ድርጅቶች መካከል አንዱ አድርጎታል።",
    "ach.tick1": "በመላ ኢትዮጵያ ለሚገኙ <b>ከ150 በላይ ትላልቅ</b> የምሕንድስና፣ የግንባታ እና የመሠረተ ልማት ፕሮጀክቶች መሣሪያ እና አገልግሎት አቅርቧል",
    "ach.tick2": "ለ Power Trader Co. (ደቡብ ኮሪያ) <b>ብቸኛ ውክልና</b> መሥርቷል",
    "ach.tick3": "ደጋግመው የሚመለሱ ደንበኞች <b>በፕሮጀክቶቻችን ታሪክ ውስጥ</b> አዎንታዊ አስተያየት ሰጥተዋል",
    "ach.tick4": "ወደ <b>ታዳሽ ኃይል</b> ተስፋፍቷል — በፀሐይ ኃይል የሚሠሩ የውኃ ፓምፖች እና ተዛማጅ ቴክኖሎጂዎች",
    "ach.tick5": "በስትራቴጂክ መጋዘን እና ፈጣን ምላሽ በሚሰጥ የቴክኒክ ቡድን የተደገፈ በመላ አገሪቱ የተዘረጋ የስርጭት መረብ",
    "ach.serveSubhead": "የምናገለግላቸው",
    "serve1.t": "የምሕንድስና እና ግንባታ ድርጅቶች",
    "serve1.d": "ተቋራጮች እና የመንገድ፣ የሕንፃ እና የመሠረተ ልማት ፕሮጀክቶች",
    "serve2.t": "ግብርና እና አግሮ-ኢንዱስትሪ",
    "serve2.d": "መስኖ፣ እርሻዎች እና የማቀነባበሪያ ተቋማት",
    "serve3.t": "የመንግሥት እና የውኃ ፕሮግራሞች",
    "serve3.d": "የመሠረተ ልማት እና የውኃ አቅርቦት ፕሮጀክቶች",
    "serve4.t": "ኢንዱስትሪ እና መንግሥታዊ ያልሆኑ ድርጅቶች",
    "serve4.d": "የማምረቻ ፋብሪካዎች እና የልማት ተቋማት",
    "ach.certSubhead": "የምስክር ወረቀቶች እና ኤግዚቢሽኖች",
    "cert1.cap": "ኢትዮ-ኮን 2014 — 11ኛው ዓለም አቀፍ የግንባታ ኤግዚቢሽን",
    "cert2.cap": "ኢትዮ-ኮን 2015 — 12ኛው ዓለም አቀፍ የግንባታ ኤግዚቢሽን",
    "cert3.cap": "Caprari — የፓምፕ ቴክኒክ ስልጠና፣ ኢንጂነር ከድር ኢብራሂም",
    "cert4.cap": "SANY Heavy Industry — የምርት ስልጠና የምስክር ወረቀት",
    "ach.photoSubhead": "በሜዳ ላይ እና በኤግዚቢሽኑ",
    "photo1.cap": "በኤግዚቢሽን ላይ ከ Power Trader አጋሮች ጋር",
    "photo2.cap": "ከ Power Trader Co.፣ ደቡብ ኮሪያ ጋር ውይይት",
    "photo3.cap": "ለሳይት ኢንጂነሮች Power ብሬከሮችን ማስተዋወቅ",
    "photo4.cap": "የ KI የሽያጭ እና የቴክኒክ ቡድን",
    "photo5.cap": "በቻይና ከአምራች አጋር ጋር ውይይት",
    "photo6.cap": "በቻይና በአጋር ፋብሪካ",
    "photo7.cap": "በህንድ “ቫይብራንት ጉጃራት” ስብሰባ ላይ",
    "photo8.cap": "የ KI እና Power Trader ማሳያ",
    "photo9.cap": "ከኃይል መሣሪያ አቅራቢ ጋር ውይይት",
    "photo10.cap": "በዓለም አቀፍ ትርኢት ላይ ከማሽነሪ መካከል",
    "photo11.cap": "በደቡብ ኮሪያ ከ MSB ሃይድሮሊክ ብሬከር አጋሮች ጋር",
    "photo12.cap": "የ SANY የግንባታ ማሽነሪ ፋብሪካን በመጎብኘት",
    "photo13.cap": "በኤግዚቢሽን ላይ የ KI የመሣሪያ መፍትሔዎችን ከጎብኚዎች ጋር መወያየት",
    "photo14.cap": "የ SANY የሰሜን አፍሪካ ዲለሮች ኮንፈረንስ 2014",
    "ach.testSubhead": "ደንበኞች ምን ይላሉ",
    "q1": "KI Construction Materials ከፍተኛ ጥራት ያለው ማሽነሪ እና ልዩ የደንበኛ አገልግሎት አቅርቧል። ጥራት ያላቸው ምርቶቻቸው እና ሙያዊ ድጋፋቸው የግንባታ ፕሮጀክቴን ቀላል እና ውጤታማ አድርገውታል።",
    "q1c": "— ተቋራጭ፣ አዲስ አበባ",
    "q2": "አስተማማኝ እና ሙያዊ። ሰፊ የማሽነሪ ምርጫቸው እና ፈጣን ድጋፋቸው ከጠበቅሁት በላይ በሆነ መሣሪያ ፕሮጀክቴን በተሳካ ሁኔታ እንዳጠናቅቅ ረድተውኛል።",
    "q2c": "— የፕሮጀክት ሥራ አስኪያጅ፣ ኦሮሚያ",
    "q3": "ሰፊ ምርጫቸው፣ ተወዳዳሪ ዋጋቸው እና ዕውቀት ያለው ሠራተኞቻቸው ለፕሮጀክቴ ተስማሚ የሆነ ማሽነሪ እንዳገኝ ስለረዱኝ ተደንቄአለሁ።",
    "q3c": "— የመሣሪያ ገዢ",
    "q4": "KI Construction Materials Importer የላቀ አገልግሎት እና ድጋፍ አድርጎልናል። ለፍላጎታችን የሚሰጡት ፈጣን ምላሽ በሥራችን ላይ ትልቅ ለውጥ አምጥቷል።",
    "q4c": "— የኦፕሬሽን ኃላፊ",
    "q5": "በዘላቂነት እና በአስተማማኝነት ከጠበቅነው በላይ ሆኗል። ለሁሉም ከባድ የግንባታ ሥራዎቻችን ምርቶቻቸውን ማመን እንችላለን።",
    "q5c": "— የሳይት ኢንጂነር",
    "ach.custSubhead": "ከከበሩ ደንበኞቻችን መካከል",

    /* ---- Contact page ---- */
    "contact.eyebrow": "ያግኙን",
    "contact.h2": "ይደውሉ፣ መልእክት ይላኩ ወይም ቢሮ ይምጡ",
    "contact.intro": "የሚፈልጉትን በመስመር ላይ ያስገቡ፣ ወይም በስልክ፣ በWhatsApp ወይም በTelegram በቀጥታ ያግኙን — ለዋጋ ማቅረቢያ ወይም ለቴክኒክ ጥያቄ ፈጣኑ መንገድ።",
    "contact.officeLabel": "ቢሮ",
    "contact.addr": "ሳሙኤል ደረሳ ሕንፃ፣ 4ኛ ፎቅ፣ ቢሮ ቁ. 102/4/11F<br>ቸርችል ጎዳና፣ ፒያሳ · አራዳ ክፍለ ከተማ፣ ወረዳ 01 · አዲስ አበባ፣ ኢትዮጵያ<br><span style=\"color:var(--muted);font-weight:500\">ከድሮው አንበሳ ፋርማሲ አጠገብ፣ ከ3F ሕንፃ ቅርብ</span>",
    "contact.phoneLabel": "ዋና ስልክ",
    "contact.salesLabel": "የሽያጭ ቡድን",
    "contact.phoneNote": "ፖ.ሳ.ቁ. 1000",
    "contact.emailLabel": "ኢሜይል",
    "contact.tgLabel": "ቴሌግራም",
    "contact.cta1": "ይደውሉ +251 911 230787",
    "contact.cta2": "በWhatsApp ያግኙን",
    "contact.cta3": "በTelegram መልእክት ይላኩ",
    "map.title": "የ KI Construction Materials Importer አድራሻ — ፒያሳ፣ አዲስ አበባ",
    "map.fallback": "አቅጣጫ ያግኙ →",

    /* ---- quote form ---- */
    "btn.quote": "የዋጋ ማቅረቢያ ይጠይቁ",
    "quote.eyebrow": "የዋጋ ጥያቄ",
    "quote.h1": "የዋጋ ማቅረቢያ ይጠይቁ",
    "quote.lead": "የሚፈልጉትን ይንገሩን፤ ቡድናችን አብዛኛውን ጊዜ በ24 ሰዓት ውስጥ የዋጋ ማቅረቢያ ይልክልዎታል። ፕሮፎርማ ደረሰኝ ከፈለጉ የቲን ቁጥርዎን ያካትቱ።",
    "quote.f.company": "የኩባንያ ስም",
    "quote.f.companyPh": "የኩባንያዎ ስም",
    "quote.f.contact": "የመገናኛ ሰው (ሙሉ ስም)",
    "quote.f.contactPh": "የመጀመሪያ እና የአባት ስም",
    "quote.f.jobTitle": "የሥራ መደብ",
    "quote.f.jobTitlePh": "ለምሳሌ የግዥ ኃላፊ",
    "quote.f.optional": "(አማራጭ)",
    "quote.f.phone": "ስልክ",
    "quote.f.phonePh": "+251911234567",
    "quote.f.phoneHelp": "+251XXXXXXXXX፣ 09XXXXXXXX ወይም 07XXXXXXXX",
    "quote.f.email": "ኢሜይል",
    "quote.f.emailPh": "you@company.com",
    "quote.f.tin": "የቲን ቁጥር",
    "quote.f.tinPh": "10 አሃዞች",
    "quote.f.tinHelp": "ለፕሮፎርማ ደረሰኝ ያስፈልጋል",
    "quote.f.category": "የምርት ዘርፍ",
    "quote.f.catPh": "ዘርፍ ይምረጡ…",
    "quote.f.catOther": "ሌላ",
    "quote.f.specs": "ዝርዝር መግለጫ እና ብዛት",
    "quote.f.specsPh": "ለምሳሌ 2 × Perkins 100 kVA ጸጥ ያለ ጄነሬተር ከ ATS ጋር",
    "quote.f.location": "የመላኪያ ቦታ (ከተማ / ሳይት)",
    "quote.f.locationPh": "ለምሳሌ አዲስ አበባ፣ ቦሌ",
    "quote.f.neededBy": "የሚያስፈልግበት ቀን",
    "quote.f.submit": "የዋጋ ጥያቄ ላክ",
    "quote.f.sending": "በመላክ ላይ…",
    "quote.f.note": "አካውንት አያስፈልግም። መረጃዎን የምንጠቀመው የዋጋ ማቅረቢያዎን ለማዘጋጀት እና ለመላክ ብቻ ነው።",
    "quote.err.company": "እባክዎ የኩባንያዎን ስም ያስገቡ",
    "quote.err.contact": "እባክዎ የመገናኛ ሰውን ስም ያስገቡ",
    "quote.err.phone": "ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ያስገቡ",
    "quote.err.email": "ትክክለኛ የኢሜይል አድራሻ ያስገቡ",
    "quote.err.tin": "ቲን በትክክል 10 አሃዞች መሆን አለበት",
    "quote.err.category": "እባክዎ የምርት ዘርፍ ይምረጡ",
    "quote.err.specs": "እባክዎ የሚፈልጉትን ይግለጹ",
    "quote.err.location": "እባክዎ የመላኪያ ቦታ ያስገቡ",
    "quote.msg.ok": "እናመሰግናለን — ቡድናችን በ24 ሰዓት ውስጥ ያገኝዎታል።",
    "quote.msg.fail": "የሆነ ችግር ተፈጥሯል። እባክዎ እንደገና ይሞክሩ ወይም ጥያቄዎን በ WhatsApp ይላኩ።",
    "quote.msg.waFallback": "በ WhatsApp ይላኩ",
    "quote.altH": "መነጋገር ይመርጣሉ?",
    "quote.altP": "ይደውሉ፣ WhatsApp ወይም Telegram — በቀጥታ ወደ ቡድናችን።",
    "quote.card.h": "በቀጥታ ያግኙን",
    "quote.card.reply": "በ24 ሰዓት ውስጥ እንመልሳለን።",

    /* ---- footer ---- */
    "footer.desc": "የግንባታ እና የኢንዱስትሪ ማሽነሪ እና ማቴሪያል አስመጪ፣ ላኪ እና አከፋፋይ። አዲስ አበባ፣ ኢትዮጵያ። የተመሠረተው በ2006 ዓ.ም።",
    "footer.ptLine": "በኢትዮጵያ የ Power Trader Co. (ደቡብ ኮሪያ) ብቸኛ ወኪል።",
    "footer.exploreH": "ዳስስ",
    "footer.contactH": "አግኙን",
    "footer.sales": "የሽያጭ ቡድን:",
    "footer.pobox": "ፖ.ሳ.ቁ. 1000፣ አዲስ አበባ",
    "footer.copyright": "&copy; <span id=\"yr\">2019</span> ዓ.ም KI Construction Materials Importer። መብቱ በሕግ የተጠበቀ ነው።",
    "footer.velora": "ድረ-ገጹ በ Velora Software የተሠራ",
    "fab.aria": "በWhatsApp ያነጋግሩን"
  }};

  var DOC_TITLE = {
    en: document.title,
    am: (document.querySelector('meta[name="title-am"]') || {}).content || document.title
  };

  var ORIG = new WeakMap();
  function apply(attr, mode) {
    var dict = document.documentElement.lang === "am" ? I18N.am : null;
    var nodes = document.querySelectorAll("[" + attr + "]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute(attr);
      var store = ORIG.get(el) || {};
      if (store[mode] === undefined) {
        store[mode] = mode === "text" ? el.textContent
                    : mode === "html" ? el.innerHTML
                    : el.getAttribute(mode) || "";
        ORIG.set(el, store);
      }
      var val = dict && dict[key] != null ? dict[key] : store[mode];
      if (mode === "text") el.textContent = val;
      else if (mode === "html") el.innerHTML = val;
      else el.setAttribute(mode, val);
    }
  }

  function gregorianToEthiopianYear(date) {
    var gYear = date.getFullYear();
    var isLeap = function (y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; };
    // Ethiopian New Year (Meskerem 1) falls on Sep 11, or Sep 12 in the year
    // before a Gregorian leap year.
    var newYearDay = isLeap(gYear + 1) ? 12 : 11;
    var newYear = new Date(gYear, 8, newYearDay);
    return date >= newYear ? gYear - 7 : gYear - 8;
  }

  function stampYear() {
    var yr = document.getElementById("yr");
    if (yr) yr.textContent = gregorianToEthiopianYear(new Date());
  }

  function setLang(l) {
    l = l === "am" ? "am" : "en";
    document.documentElement.lang = l;
    apply("data-i18n", "text");
    apply("data-i18n-html", "html");
    apply("data-i18n-aria", "aria-label");
    apply("data-i18n-title", "title");
    apply("data-i18n-placeholder", "placeholder");
    document.title = DOC_TITLE[l] || DOC_TITLE.en;
    stampYear();
    try { localStorage.setItem("ki_lang", l); } catch (e) {}
    var lb = document.querySelectorAll(".langbtn");
    for (var i = 0; i < lb.length; i++) {
      lb[i].setAttribute("aria-pressed", lb[i].dataset.lang === l ? "true" : "false");
    }
  }

  var lb = document.querySelectorAll(".langbtn");
  for (var i = 0; i < lb.length; i++) {
    lb[i].addEventListener("click", function () { setLang(this.dataset.lang); });
  }

  // Amharic temporarily disabled sitewide (langswitch hidden in assets.css) — always render English,
  // even for a returning visitor with "am" saved. To re-enable, restore the localStorage read below.
  var saved = "en";
  setLang(saved);

  /* ---------- quote form (quote.html only) ---------- */
  var qForm = document.getElementById("quoteForm");
  if (qForm) {
    var CAT_MAP = {
      gensets: "Generating sets & power",
      breakers: "Hydraulic breakers",
      pumps: "Pumps & solar pumps",
      machinery: "Construction machinery",
      electro: "Electromechanical"
    };
    var PH_RE = /^(\+251[1-9]\d{8}|0[1-9]\d{8})$/;
    var TIN_RE = /^\d{10}$/;
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var qMsg = document.getElementById("quoteMsg");
    var qBtn = qForm.querySelector('button[type="submit"]');
    var qBtnLabel = qBtn.querySelector("span") || qBtn;
    var keyEl = qForm.querySelector('[name="access_key"]');
    var KEY_OK = keyEl && keyEl.value && !/PASTE|YOUR_|_HERE/i.test(keyEl.value);

    function t(key, en) {
      var d = document.documentElement.lang === "am" ? I18N.am : null;
      return (d && d[key] != null) ? d[key] : en;
    }
    function fieldOf(name) {
      var el = qForm.querySelector('[name="' + name + '"]');
      return el ? el.closest(".field") : null;
    }
    function describeField(field, input, bad) {
      var descriptions = [];
      field.querySelectorAll(".help, .err").forEach(function (note, index) {
        if (!note.id) note.id = input.id + "-description-" + index;
        if (bad || !note.classList.contains("err")) descriptions.push(note.id);
      });
      if (descriptions.length) input.setAttribute("aria-describedby", descriptions.join(" "));
      else input.removeAttribute("aria-describedby");
    }
    function mark(name, bad) {
      var f = fieldOf(name);
      if (f) {
        f.classList.toggle("invalid", !!bad);
        var input = f.querySelector("input, select, textarea");
        if (input) {
          if (bad) input.setAttribute("aria-invalid", "true");
          else input.removeAttribute("aria-invalid");
          describeField(f, input, bad);
        }
      }
      return !bad;
    }
    function val(name) {
      var el = qForm.querySelector('[name="' + name + '"]');
      return el ? el.value.trim() : "";
    }
    function phoneValue() {
      return val("phone").replace(/[\s().-]/g, "").replace(/^00251/, "+251");
    }
    // Expose inline errors and help text when a screen reader focuses a field.
    qForm.querySelectorAll(".field").forEach(function (field) {
      var input = field.querySelector("input, select, textarea");
      if (!input || !input.id) return;
      describeField(field, input, false);
    });
    function validate() {
      var ok = true;
      ok = mark("company", !val("company")) && ok;
      ok = mark("contact_name", !val("contact_name")) && ok;
      ok = mark("phone", !PH_RE.test(phoneValue())) && ok;
      ok = mark("email", !EMAIL_RE.test(val("email"))) && ok;
      ok = mark("tin", !(val("tin") === "" || TIN_RE.test(val("tin")))) && ok;
      ok = mark("category", !val("category")) && ok;
      ok = mark("specs", !val("specs")) && ok;
      ok = mark("delivery_location", !val("delivery_location")) && ok;
      return ok;
    }
    function waLink() {
      var lines = [
        "Quote request — " + (val("company") || "?"),
        "Contact: " + val("contact_name") + (val("job_title") ? " (" + val("job_title") + ")" : ""),
        "Phone: " + val("phone"),
        "Email: " + val("email"),
        val("tin") ? "TIN: " + val("tin") : "",
        "Category: " + val("category"),
        "Details: " + val("specs"),
        "Delivery: " + val("delivery_location"),
        val("needed_by") ? "Needed by: " + val("needed_by") : ""
      ].filter(Boolean);
      return "https://wa.me/251911230787?text=" + encodeURIComponent(lines.join("\n"));
    }
    function showFail() {
      qMsg.className = "form-msg fail";
      qMsg.textContent = "";
      var p = document.createElement("p");
      p.textContent = t("quote.msg.fail", "Something went wrong. Please try again, or send your request via WhatsApp.");
      var a = document.createElement("a");
      a.className = "btn btn-wa";
      a.href = waLink();
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = t("quote.msg.waFallback", "Send via WhatsApp instead");
      qMsg.appendChild(p);
      qMsg.appendChild(a);
      qMsg.hidden = false;
      qMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    function showOk() {
      qForm.reset();
      qForm.querySelectorAll("input, select, textarea").forEach(function (input) {
        mark(input.name, false);
      });
      qMsg.className = "form-msg ok";
      qMsg.textContent = t("quote.msg.ok", "Thank you — our team will contact you within 24 hours.");
      qMsg.hidden = false;
      qMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // pre-select category from ?cat=
    var catParam = new URLSearchParams(location.search).get("cat");
    if (catParam && CAT_MAP[catParam]) {
      var catSel = qForm.querySelector('[name="category"]');
      if (catSel) catSel.value = CAT_MAP[catParam];
    }

    // clear a field's error as the user fixes it
    function clearError(e) { if (e.target.name) mark(e.target.name, false); }
    qForm.addEventListener("input", clearError);
    qForm.addEventListener("change", clearError);

    qForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (qBtn.disabled) return;
      qMsg.hidden = true;
      qMsg.className = "form-msg";
      if (!validate()) {
        var first = qForm.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
        if (first) first.focus();
        return;
      }
      if (!KEY_OK) { showFail(); return; }

      var fd = new FormData(qForm);
      fd.set("subject", "New Quote Request — " + fd.get("company") + " — " + fd.get("category"));
      fd.set("phone", phoneValue());
      fd.set("email", val("email"));
      fd.set("replyto", val("email"));

      qBtn.disabled = true;
      var restore = qBtnLabel.textContent;
      qBtnLabel.textContent = t("quote.f.sending", "Sending…");
      qForm.setAttribute("aria-busy", "true");
      var controller = new AbortController();
      var timeout = setTimeout(function () { controller.abort(); }, 15000);

      fetch("https://api.web3forms.com/submit", {
        method: "POST", body: fd, headers: { "Accept": "application/json" }, signal: controller.signal
      })
        .then(function (r) { if (!r.ok) throw new Error("Request failed"); return r.json(); })
        .then(function (data) { if (data && data.success) showOk(); else throw new Error("fail"); })
        .catch(function () { showFail(); })
        .then(function () {
          clearTimeout(timeout);
          qBtn.disabled = false;
          qBtnLabel.textContent = restore;
          qForm.removeAttribute("aria-busy");
        });
    });
  }
})();

/* home hero: fit exactly one screen — the top bar wraps to two lines on tablets, so
   measure the real top bar + sticky header height instead of trusting the CSS fallback */
(function () {
  "use strict";
  var hero = document.querySelector(".hero");
  if (!hero) return;
  var topbar = document.querySelector(".topbar"), header = document.querySelector("header.site");
  function setOffset() {
    var h = (topbar ? topbar.offsetHeight : 0) + (header ? header.offsetHeight : 0) + 4; // + hero's 4px bottom border
    hero.style.setProperty("--hero-offset", h + "px");
  }
  setOffset();
  window.addEventListener("resize", setOffset);
})();
