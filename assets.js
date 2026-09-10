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
    btn.addEventListener("click", function () {
      var open = mnav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mnav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        mnav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

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
    "hero.h1": "የግንባታና የኢንዱስትሪ ማሽነሪ — ወደ ኢትዮጵያ አስመጥተን በመላ አገሪቱ እናደርሳለን",
    "hero.slogan": "“ጥራት ቅድሚያ ነው፣ የደንበኛ እርካታ ፍላጎታችን ነው”",
    "hero.lead": "KI Construction Materials Importer ለተቋራጮች፣ ለኢንዱስትሪው እና ለመንግሥት ተቋማት ጄነሬተሮች፣ ሃይድሮሊክ ብሬከሮች፣ ፓምፖች፣ የግንባታ ማሽነሪ እና ኤሌክትሮ-ሜካኒካል ምርቶችን ያቀርባል። በኢትዮጵያ ውስጥ የ Power Trader Co. (ደቡብ ኮሪያ) ብቸኛ ወኪል።",
    "hero.badge1": "<span class=\"dot\">●</span><b>22 ዓመት</b> የዘርፉ ልምድ",
    "hero.badge2": "<span class=\"dot\">●</span><b>150+</b> ፕሮጀክቶች አቅርቦት",
    "hero.badge3": "<span class=\"dot\">●</span><b>ማስመጣት · ወደ ውጭ መላክ · ስርጭት</b>",
    "hero.chip": "<b>በመላ አገሪቱ</b> አቅርቦት እና የድህረ-ሽያጭ ድጋፍ",

    "brands.label": "የምንወክላቸው ብራንዶች",
    "brands.pt": "ብቸኛ<br>ወኪል · ኢትዮጵያ",

    "stats.n1": "2006 ዓ.ም",
    "stats.n2": "22 ዓመት",
    "stats.l1": "ተመሥርቶ የተመዘገበ",
    "stats.l2": "የመሥራቹ የዘርፍ ልምድ",
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
    "p1.desc": "የ Perkins፣ Cummins እና Güçbir ዲዘል ጄነሬተሮች — ጸጥ ያለ (silent) እና ክፍት (open) ዓይነት፣ ከ20 KVA እስከ 250 KVA።",
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
    "p4.desc": "ለማንኛውም መጠን ግንባታ ቦታ የሚሆኑ የመጠቅጠቅ (compaction)፣ የኮንክሪት እና የማቴሪያል ማንቀሳቀሻ መሣሪያዎች።",
    "p4.li1": "ፕሌት ኮምፓክተሮች፣ ታምፒንግ ራመሮች፣ ፖከር ቫይብሬተሮች",
    "p4.li2": "የኮንክሪት ማቀላቀያዎች እና የ Honcha ብሎኬት ማሽኖች",
    "p4.li3": "ስክሪው እና ፒስተን የአየር ኮምፕረሰሮች፣ ሎደሮች",

    "p5.title": "ኤሌክትሮ-ሜካኒካል",
    "p5.desc": "ለውኃ አቅርቦት፣ ለመስኖ እና ለኢንዱስትሪ ተከላዎች የሚሆኑ ቧንቧዎችና ማያያዣዎች።",
    "p5.li1": "የHDPE እና GI ቧንቧ ማያያዣዎች",
    "p5.li2": "ቫልቮች እና የመቆጣጠሪያ መለዋወጫዎች",
    "p5.li3": "የኢንዱስትሪ እና የግብርና ማያያዣዎች",

    /* why-KI band (home) */
    "why.eyebrow": "ለምን KI",
    "why.h2": "ሱቅ አይደለንም — የቴክኒክ ድጋፍ ያለው አስመጪ ነን",
    "why.1t": "ብቸኛ ውክልና",
    "why.1d": "በኢትዮጵያ የ Power Trader Co. (ደቡብ ኮሪያ) ሃይድሮሊክ ብሬከሮች ብቸኛ ወኪል።",
    "why.2t": "22 ዓመት ልምድ",
    "why.2d": "የመሥራቹ በግንባታ እና በኢንዱስትሪ ማሽነሪ ዘርፍ ያካበቱት ልምድ።",
    "why.3t": "በመላ አገሪቱ አቅርቦት",
    "why.3d": "በስትራቴጂክ መጋዘን የተደገፈ የስርጭት መረብ።",
    "why.4t": "የድህረ-ሽያጭ ድጋፍ",
    "why.4d": "ተከላ፣ ማስጀመር፣ መደበኛ ጥገና፣ መለዋወጫ እና የቴክኒክ ማማከር።",

    /* CTA band (most pages) */
    "band.h": "የዋጋ ማቅረቢያ ወይም የቴክኒክ መልስ ይፈልጋሉ?",
    "band.p": "ይደውሉ፣ WhatsApp ወይም Telegram — ፎርም የለም፣ በቀጥታ ወደ ቡድናችን።",

    /* shared spec labels (category pages) */
    "spec.range": "የምናቀርበው",
    "spec.brands": "ብራንዶች እና አጋሮች",
    "spec.apps": "የተለመዱ አጠቃቀሞች",
    "spec.other": "ሌሎች የምርት ዘርፎች",
    "spec.cta": "ስለዚህ ዘርፍ ይጠይቁን",
    "spec.rangeGal": "ከምርቶቻችን መካከል",
    "gs.g1": "የ Perkins ጸጥ ያለ ዲዘል ጄነሬተር (20–250 KVA)",
    "gs.g2": "ጸጥ ያለ ካኖፒ ያለው ዲዘል ጄነሬተር",
    "gs.g3": "ክፍት ዲዘል ጄነሬተር",
    "gs.g4": "ክፍት ጄነሬተሮች፣ የተለያዩ አቅሞች",
    "gs.g5": "ትናንሽ የቤንዚን እና ዲዘል ጄነሬተሮች",
    "gs.g6": "ATS እና መቆጣጠሪያ ፓነል",
    "hb.g1": "የ Power Trader ሃይድሮሊክ ብሬከሮች",
    "hb.g2": "የ Power Trader PB-ተከታታይ ብሬከር",
    "pm.g1": "ሴንትሪፉጋል ፓምፖች",
    "pm.g2": "ለጉድጓድ የሚሆኑ submersible ፓምፖች",
    "pm.g3": "ባለብዙ ደረጃ ፓምፕ",
    "pm.g4": "የፀሐይ ፓምፕ ኢንቨርተር",
    "pm.g5": "ከማጠራቀሚያ ጋር የፀሐይ ፓምፕ ተከላ",
    "pm.g6": "በፀሐይ ኃይል የሚሠራ የጉድጓድ ውኃ ቦታ",
    "cm.g1": "ጭነት ማራገፊያ መኪናዎች",
    "cm.g2": "የኮንክሪት ማቀላቀያ (ጣሊያን)",
    "cm.g3": "ፕሌት ኮምፓክተር",
    "cm.g4": "ታምፒንግ ራመር",
    "cm.g5": "ዊል ሎደር",
    "cm.g6": "የኮንክሪት ማቀላቀያ መኪና",

    /* ---- Generating sets page ---- */
    "gs.h1": "ጄነሬተሮችና የኃይል መሣሪያዎች",
    "gs.lead": "ከ20 KVA እስከ 250 KVA የሚደርሱ ዲዘል እና ጋዝ ጄነሬተሮች — ጸጥ ያለ እና ክፍት ዓይነት — ከአልተርኔተር፣ ከመቆጣጠሪያ ፓነል እና ከሙሉ ተከላ ጋር።",
    "gs.intro": "KI ለፋብሪካዎች፣ ለንግድ ሕንፃዎች፣ ለሆስፒታሎች፣ ለሆቴሎች፣ ለባንኮች እና ለግንባታ ቦታዎች የ Perkins፣ Cummins እና Güçbir ጄነሬተሮችን፣ እንዲሁም ለቀላል ጭነት የሚሆኑ ትናንሽ የቤንዚን እና ዲዘል ጄነሬተሮችን ያቀርባል። እያንዳንዱ ጄነሬተር ከጭነቱ ጋር ተመጣጥኖ በቴክኒክ ቡድናችን ተተክሎ ይጀመራል፤ መለዋወጫም በአገር ውስጥ ይያዛል።",
    "gs.r1": "የ Perkins ጸጥ ያለ እና ክፍት ዓይነት ዲዘል ጄነሬተሮች፣ 20–250 KVA",
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
    "cm.lead": "የመጠቅጠቅ፣ የኮንክሪት እና የማቴሪያል ማንቀሳቀሻ መሣሪያዎች — ከፕሌት ኮምፓክተር እስከ ዊል ሎደር እና የብሎኬት ማሽን።",
    "cm.intro": "KI አንድ ቦታ በየቀኑ የሚያስፈልገውን ማሽነሪ ያቀርባል፦ የመጠቅጠቅ እና የኮንክሪት መሣሪያ፣ የአየር ኮምፕረሰር፣ ሎደር እና የ Honcha ብሎኬት ማሽን — ከመለዋወጫ እና ከአገልግሎት ድጋፍ ጋር።",
    "cm.r1": "ፕሌት ኮምፓክተሮች እና ታምፒንግ ራመሮች",
    "cm.r2": "ፖከር/ኮንክሪት ቫይብሬተሮች እና የኮንክሪት ማቀላቀያዎች",
    "cm.r3": "የኮንክሪት ማቀላቀያ መኪናዎች እና ጭነት ማራገፊያ መኪናዎች",
    "cm.r4": "ዊል ሎደሮች",
    "cm.r5": "ስክሪው እና ፒስተን የአየር ኮምፕረሰሮች",
    "cm.r6": "የ Honcha የኮንክሪት ብሎኬት ማሽኖች",
    "cm.a1": "የሕንፃ እና የመንገድ ግንባታ",
    "cm.a2": "የኮንክሪት እና የብሎኬት ምርት",
    "cm.a3": "የመሬት ሥራ እና የማቴሪያል ማንቀሳቀስ",
    "cm.a4": "የቅድመ-ተቀረጻ እና የማምረቻ ቦታዎች",

    /* ---- Electro-mechanical page ---- */
    "em.h1": "ኤሌክትሮ-ሜካኒካል",
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

    /* ---- About page ---- */
    "about.eyebrow": "እኛ ማን ነን",
    "about.h2": "የተመሠረተ አስመጪ ነን፣ ሱቅ አይደለንም",
    "about.lead": "KI Construction Materials Importer በ2006 ዓ.ም የተመሠረተ የግንባታ እና የኢንዱስትሪ ማሽነሪ አስመጪ፣ አከፋፋይ እና የቴክኒክ አገልግሎት ድርጅት ነው።",
    "about.p1": "KI Construction Materials Importer በ<b>2006 ዓ.ም</b> ተመሥርቶ የተመዘገበ ሲሆን፣ መሥራች እና ሥራ አስኪያጅ ዳይሬክተር <b>አቶ ከድር ኢብራሂም</b> በግንባታ እና በኢንዱስትሪ ማሽነሪ ዘርፍ — ጄነሬተሮች፣ የውኃ እና የፀሐይ ፓምፖች፣ የፀሐይ ኃይል እና ኤሌክትሮ-ሜካኒካል ሥራዎች — በሽያጭ እና በግብይት <b>22 ዓመት ልምድ</b> አላቸው።",
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
    "team.t2": "የፋይናንስ ኃላፊ",
    "team.t3": "አካውንታንት",
    "team.t4": "ገንዘብ ያዥ",
    "team.t5": "የሽያጭ እና ግብይት ኃላፊ",
    "team.t6": "የሽያጭ ኢንጂነር",
    "team.t7": "የጨረታ ኃላፊ",
    "team.t8": "የሕግ አማካሪ",
    "team.t9": "ኤሌክትሮ-ሜካኒካል እና የቢሮ ኢንጂነር",
    "about.figcap": "አቶ ከድር ኢብራሂም፣ መሥራች እና ሥራ አስኪያጅ ዳይሬክተር፣ በዓለም አቀፍ የማሽነሪ ኤግዚቢሽን ላይ።",

    /* ---- Achievements page ---- */
    "ach.eyebrow": "የሥራ ታሪክ",
    "ach.h2": "150+ ፕሮጀክቶች፣ ብቸኛ ውክልና እና ደጋግመው የሚመጡ ደንበኞች",
    "ach.lead": "ጥራት እና የደንበኛ እርካታ ላይ ያለን ጽናት KI በኢትዮጵያ ካሉ ታማኝ የንግድ ድርጅቶች መካከል አንዱ አድርጎታል።",
    "ach.tick1": "በመላ ኢትዮጵያ ለሚገኙ <b>ከ150 በላይ ትላልቅ</b> የምሕንድስና፣ የግንባታ እና የመሠረተ ልማት ፕሮጀክቶች መሣሪያ እና አገልግሎት አቅርቧል",
    "ach.tick2": "ለ Power Trader Co. (ደቡብ ኮሪያ) <b>ብቸኛ ውክልና</b> መሥርቷል",
    "ach.tick3": "በደንበኛ እርካታ ጥናቶች ላይ ደጋግሞ <b>ከፍተኛ ደረጃ</b> ያገኘ አከፋፋይ",
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
    "cert3.cap": "Caprari — የፓምፕ ቴክኒክ ስልጠና፣ አቶ ከድር ኢብራሂም",
    "cert4.cap": "SANY Heavy Industry — የምርት ስልጠና የምስክር ወረቀት",
    "ach.photoSubhead": "በሜዳ ላይ እና በኤግዚቢሽኑ",
    "photo1.cap": "በኤግዚቢሽን ላይ ከ Power Trader አጋሮች ጋር",
    "photo2.cap": "ከ Power Trader Co.፣ ደቡብ ኮሪያ ጋር ውይይት",
    "photo3.cap": "ለሳይት ኢንጂነሮች Power ብሬከሮችን ማስተዋወቅ",
    "photo4.cap": "የ KI የሽያጭ እና የቴክኒክ ቡድን",
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
    "contact.intro": "ፎርም የለም። በስልክ፣ በWhatsApp ወይም በTelegram በቀጥታ ያግኙን — ለዋጋ ማቅረቢያ ወይም ለቴክኒክ ጥያቄ ፈጣኑ መንገድ።",
    "contact.officeLabel": "ቢሮ",
    "contact.addr": "ሳሙኤል ደረሳ ሕንፃ፣ 4ኛ ፎቅ፣ ቢሮ ቁ. 102/4/11F<br>ቸርችል ጎዳና፣ ፒያሳ · አራዳ ክፍለ ከተማ፣ ወረዳ 01 · አዲስ አበባ፣ ኢትዮጵያ<br><span style=\"color:var(--muted);font-weight:500\">ከድሮው አንበሳ ፋርማሲ አጠገብ፣ ከ3F ሕንፃ ቅርብ</span>",
    "contact.phoneLabel": "ስልክ እና ሞባይል",
    "contact.phoneNote": "ፋክስ +251 111 262530 · ፖ.ሳ.ቁ. 11127",
    "contact.emailLabel": "ኢሜይል",
    "contact.tgLabel": "ቴሌግራም",
    "contact.cta1": "ይደውሉ +251 911 230787",
    "contact.cta2": "በWhatsApp ያግኙን",
    "contact.cta3": "በTelegram መልእክት ይላኩ",
    "map.title": "የ KI Construction Materials Importer አድራሻ — ፒያሳ፣ አዲስ አበባ",
    "map.fallback": "በGoogle Maps ይክፈቱ →",

    /* ---- footer ---- */
    "footer.desc": "የግንባታ እና የኢንዱስትሪ ማሽነሪ እና ማቴሪያል አስመጪ፣ ላኪ እና አከፋፋይ። አዲስ አበባ፣ ኢትዮጵያ። የተመሠረተው በ2006 ዓ.ም።",
    "footer.ptLine": "በኢትዮጵያ የ Power Trader Co. (ደቡብ ኮሪያ) ብቸኛ ወኪል።",
    "footer.exploreH": "ዳስስ",
    "footer.contactH": "አግኙን",
    "footer.pobox": "ፖ.ሳ.ቁ. 11127፣ አዲስ አበባ",
    "footer.copyright": "&copy; <span id=\"yr\">2026</span> KI Construction Materials Importer። መብቱ በሕግ የተጠበቀ ነው።",
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

  function stampYear() {
    var yr = document.getElementById("yr");
    if (yr) yr.textContent = new Date().getFullYear();
  }

  function setLang(l) {
    l = l === "am" ? "am" : "en";
    document.documentElement.lang = l;
    apply("data-i18n", "text");
    apply("data-i18n-html", "html");
    apply("data-i18n-aria", "aria-label");
    apply("data-i18n-title", "title");
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

  var saved = "en";
  try { saved = localStorage.getItem("ki_lang") || "en"; } catch (e) {}
  setLang(saved);
})();
