/* ===== Сайт-визитка: i18n (RU/EN/FR/IT), форма-mailto, анимации ===== */

(function () {
  "use strict";

  var FORM_EMAIL = "info@emich.ru";

  /* ---------- Словарь переводов: весь контент сайта — здесь ---------- */
  var I18N = {
    ru: {
      "brand": "«EMICH»",
      "nav.benefits": "Польза",
      "nav.trust": "Доверие",
      "nav.contact": "Контакты",
      "hero.kicker": "Главный архитектор · экспертиза уникальных объектов",
      "hero.title": "Архитектура от идеи до реализации",
      "hero.sub": "Градостроительные концепции, проектная и рабочая документация, авторский надзор и интерьеры. BIM-проектирование в ArchiCAD и Revit.",
      "hero.cta": "Обсудить проект",
      "hero.flow": "ИДЕЯ → КОНЦЕПЦИЯ → ПРОЕКТ → РАБОЧКА → СТРОЙКА → ОБЪЕКТ",
      "hero.caption": "АРТ-ОБЪЕКТ / СВЕТОВАЯ ИНСТАЛЛЯЦИЯ",
      "benefits.title": "01 / ПОЛЬЗА",
      "benefits.lead": "Что получает заказчик",
      "b1.t": "Полный цикл",
      "b1.d": "Одна ответственная команда: от первой идеи и градостроительной концепции до рабочей документации и авторского надзора на стройке.",
      "b2.t": "BIM-точность",
      "b2.d": "ArchiCAD и Revit: трёхмерная модель вместо плоских чертежей — меньше ошибок, коллизий и переделок на стройке.",
      "b3.t": "25+ лет практики",
      "b3.d": "Проектирование с 1998 года: все стадии пройдены лично — от эскиза до ввода объекта в эксплуатацию.",
      "b4.t": "Международный уровень",
      "b4.d": "Конкурсы в Лондоне, Варне и Сколково; объекты в Италии, Франции, Латвии и Германии.",
      "b5.t": "Три масштаба в одних руках",
      "b5.d": "Здания, интерьеры и территории проектируются как единая среда.",
      "b6.t": "Экспертиза уникальных объектов",
      "b6.d": "Сложные и новаторские проекты в коллаборации с бюро мирового уровня, включая работу с объектами наследия.",
      "trust.title": "02 / ДОВЕРИЕ",
      "trust.lead": "Цифры и факты",
      "n.projects": "проектов выполнено",
      "n.years": "лет в профессии",
      "n.contests": "конкурсов и фестивалей",
      "awards.title": "Награды и признание",
      "a1": "1 место — открытый национальный конкурс концепций благоустройства общественных пространств",
      "a2": "Гран-при — арт-фестиваль «Толмачи»",
      "a3": "Short-list — технопарк «Сколково»",
      "a4": "Short-list — модульные дома в эко-парке «Ясно-поле»",
      "a5": "Участник выставок «Золотое сечение» и «Зодчество»",
      "projects.title": "Значимые проекты",
      "p1": "Здание исследовательского центра МФТИ, Долгопрудный",
      "p2": "Городские и загородные резиденции, коттеджные посёлки",
      "p3": "Развитие территорий: площади, парки, набережные",
      "p4": "Общественные здания и учреждения здравоохранения",
      "p5": "Частные владения: Рим, Антиб, Юрмала, Фрайбург",
      "p6": "Конкурсы: библиотека в Варне, London National Park City, VYKSA 10000",
      "showcase.title": "03 / ПРОЕКТ В РАБОТЕ",
      "showcase.lead": "Исследовательский центр МФТИ, Долгопрудный",
      "form.title": "04 / ОБСУДИМ ВАШ ПРОЕКТ",
      "form.sub": "Опишите задачу — отвечу в течение рабочего дня.",
      "f.name": "Имя",
      "f.name.ph": "Как к вам обращаться",
      "f.contact": "Контакт",
      "f.contact.ph": "Телефон или e-mail",
      "f.msg": "О задаче",
      "f.msg.ph": "Тип объекта, площадка, сроки — парой фраз",
      "f.submit": "Отправить заявку",
      "f.note": "Нажатие откроет вашу почту с готовым письмом — сайт не хранит никаких данных.",
      "f.mail.subject": "Заявка с сайта",
      "contacts.title": "Контакты",
      "c.phone": "Телефон",
      "c.email": "Почта",
      "c.city": "Город",
      "c.city.value": "Москва",
      "footer.tag": "Архитектурное проектирование"
    },

    en: {
      "brand": "«EMICH»",
      "nav.benefits": "Value",
      "nav.trust": "Track record",
      "nav.contact": "Contacts",
      "hero.kicker": "Chief architect · expertise in unique projects",
      "hero.title": "Architecture from idea to completion",
      "hero.sub": "Urban concepts, design & construction documentation, author's supervision and interiors. BIM design in ArchiCAD and Revit.",
      "hero.cta": "Discuss your project",
      "hero.flow": "IDEA → CONCEPT → DESIGN → DETAILING → CONSTRUCTION → BUILDING",
      "hero.caption": "ART OBJECT / LIGHT INSTALLATION",
      "benefits.title": "01 / VALUE",
      "benefits.lead": "What the client gets",
      "b1.t": "Full cycle",
      "b1.d": "One accountable team: from the first idea and urban concept to detailed design and author's supervision on site.",
      "b2.t": "BIM precision",
      "b2.d": "ArchiCAD and Revit: a 3D model instead of flat drawings — fewer errors, clashes and rework on site.",
      "b3.t": "25+ years of practice",
      "b3.d": "Designing since 1998: every stage mastered first-hand — from sketch to commissioning.",
      "b4.t": "International level",
      "b4.d": "Competitions in London, Varna and Skolkovo; projects in Italy, France, Latvia and Germany.",
      "b5.t": "Three scales in one hand",
      "b5.d": "Buildings, interiors and territories are designed as a single environment.",
      "b6.t": "Expertise in unique projects",
      "b6.d": "Ambitious and complex projects in collaboration with world-class bureaus, including heritage sites.",
      "trust.title": "02 / TRUST",
      "trust.lead": "Facts and figures",
      "n.projects": "projects completed",
      "n.years": "years in the profession",
      "n.contests": "contests & festivals",
      "awards.title": "Awards & recognition",
      "a1": "1st prize — open national competition for public-space improvement concepts",
      "a2": "Grand Prix — “Tolmachi” art festival",
      "a3": "Short-list — Skolkovo Technopark",
      "a4": "Short-list — modular houses in “Yasno-Pole” eco-park",
      "a5": "Exhibitor at “Golden Section” and “Zodchestvo” exhibitions",
      "projects.title": "Key projects",
      "p1": "MIPT research centre building, Dolgoprudny",
      "p2": "Urban and country residences, cottage settlements",
      "p3": "Territorial development: squares, parks, embankments",
      "p4": "Public buildings and healthcare facilities",
      "p5": "Private estates: Rome, Antibes, Jurmala, Freiburg",
      "p6": "Competitions: Varna library, London National Park City, VYKSA 10000",
      "showcase.title": "03 / PROJECT HIGHLIGHT",
      "showcase.lead": "MIPT research centre, Dolgoprudny",
      "form.title": "04 / LET'S DISCUSS YOUR PROJECT",
      "form.sub": "Describe the task — I will reply within one working day.",
      "f.name": "Name",
      "f.name.ph": "What should I call you",
      "f.contact": "Contact",
      "f.contact.ph": "Phone or e-mail",
      "f.msg": "About the task",
      "f.msg.ph": "Type of building, site, timeline — in a few words",
      "f.submit": "Send request",
      "f.note": "Clicking opens your mail app with a ready letter — the site stores nothing.",
      "f.mail.subject": "Website enquiry",
      "contacts.title": "Contacts",
      "c.phone": "Phone",
      "c.email": "E-mail",
      "c.city": "City",
      "c.city.value": "Moscow",
      "footer.tag": "Architectural design"
    },

    fr: {
      "brand": "«EMICH»",
      "nav.benefits": "Atouts",
      "nav.trust": "Références",
      "nav.contact": "Contacts",
      "hero.kicker": "Architecte en chef · expertise de projets uniques",
      "hero.title": "L'architecture, de l'idée à la réalisation",
      "hero.sub": "Concepts urbains, dossiers de conception et d'exécution, suivi de chantier et intérieurs. Conception BIM sous ArchiCAD et Revit.",
      "hero.cta": "Discuter du projet",
      "hero.flow": "IDÉE → CONCEPT → PROJET → EXÉCUTION → CHANTIER → BÂTIMENT",
      "hero.caption": "OBJET D'ART / INSTALLATION LUMINEUSE",
      "benefits.title": "01 / ATOUTS",
      "benefits.lead": "Ce que le client obtient",
      "b1.t": "Cycle complet",
      "b1.d": "Une seule équipe responsable : de la première idée et du concept urbain jusqu'au dossier d'exécution et au suivi de chantier.",
      "b2.t": "Précision BIM",
      "b2.d": "ArchiCAD et Revit : une maquette 3D au lieu de plans 2D — moins d'erreurs et de reprises sur chantier.",
      "b3.t": "Plus de 25 ans de pratique",
      "b3.d": "En conception depuis 1998 : toutes les étapes maîtrisées personnellement — de l'esquisse à la mise en service.",
      "b4.t": "Niveau international",
      "b4.d": "Concours à Londres, Varna et Skolkovo ; réalisations en Italie, en France, en Lettonie et en Allemagne.",
      "b5.t": "Trois échelles réunies",
      "b5.d": "Bâtiments, intérieurs et territoires conçus comme un environnement unique.",
      "b6.t": "Expertise de projets uniques",
      "b6.d": "Projets ambitieux et complexes en collaboration avec des agences de classe mondiale, y compris le patrimoine.",
      "trust.title": "02 / CONFIANCE",
      "trust.lead": "Chiffres et faits",
      "n.projects": "projets réalisés",
      "n.years": "années de métier",
      "n.contests": "concours et festivals",
      "awards.title": "Prix et reconnaissance",
      "a1": "1er prix — concours national ouvert de concepts d'aménagement d'espaces publics",
      "a2": "Grand Prix — festival d'art « Tolmatchi »",
      "a3": "Short-list — Technoparc Skolkovo",
      "a4": "Short-list — maisons modulaires de l'éco-parc « Iasno-Pole »",
      "a5": "Exposant aux salons « Section d'or » et « Zodtchestvo »",
      "projects.title": "Projets marquants",
      "p1": "Centre de recherche du MIPT, Dolgoproudny",
      "p2": "Résidences urbaines et de campagne, lotissements",
      "p3": "Aménagement de territoires : places, parcs, quais",
      "p4": "Bâtiments publics et établissements de santé",
      "p5": "Propriétés privées : Rome, Antibes, Jurmala, Fribourg",
      "p6": "Concours : bibliothèque de Varna, London National Park City, VYKSA 10000",
      "showcase.title": "03 / PROJET À LA UNE",
      "showcase.lead": "Centre de recherche du MIPT, Dolgoproudny",
      "form.title": "04 / PARLONS DE VOTRE PROJET",
      "form.sub": "Décrivez la tâche — réponse sous un jour ouvré.",
      "f.name": "Nom",
      "f.name.ph": "Comment vous appeler",
      "f.contact": "Coordonnées",
      "f.contact.ph": "Téléphone ou e-mail",
      "f.msg": "La tâche",
      "f.msg.ph": "Type d'objet, site, délais — en quelques mots",
      "f.submit": "Envoyer la demande",
      "f.note": "Le clic ouvre votre messagerie avec une lettre prête — le site ne conserve rien.",
      "f.mail.subject": "Demande depuis le site",
      "contacts.title": "Contacts",
      "c.phone": "Téléphone",
      "c.email": "E-mail",
      "c.city": "Ville",
      "c.city.value": "Moscou",
      "footer.tag": "Conception architecturale"
    },

    it: {
      "brand": "«EMICH»",
      "nav.benefits": "Vantaggi",
      "nav.trust": "Credenziali",
      "nav.contact": "Contatti",
      "hero.kicker": "Architetto capo · expertise in progetti unici",
      "hero.title": "Architettura dall'idea alla realizzazione",
      "hero.sub": "Concept urbanistici, progettazione preliminare ed esecutiva, direzione artistica e interni. Progettazione BIM in ArchiCAD e Revit.",
      "hero.cta": "Parliamo del progetto",
      "hero.flow": "IDEA → CONCEPT → PROGETTO → ESECUTIVO → CANTIERE → EDIFICIO",
      "hero.caption": "OGGETTO D'ARTE / INSTALLAZIONE LUMINOSA",
      "benefits.title": "01 / VANTAGGI",
      "benefits.lead": "Cosa ottiene il cliente",
      "b1.t": "Ciclo completo",
      "b1.d": "Un unico team responsabile: dalla prima idea e dal concept urbanistico fino al progetto esecutivo e alla direzione artistica in cantiere.",
      "b2.t": "Precisione BIM",
      "b2.d": "ArchiCAD e Revit: un modello 3D al posto dei disegni 2D — meno errori e rifacimenti in cantiere.",
      "b3.t": "Oltre 25 anni di pratica",
      "b3.d": "In progettazione dal 1998: tutte le fasi seguite personalmente — dallo schizzo alla consegna.",
      "b4.t": "Livello internazionale",
      "b4.d": "Concorsi a Londra, Varna e Skolkovo; opere in Italia, Francia, Lettonia e Germania.",
      "b5.t": "Tre scale in una mano",
      "b5.d": "Edifici, interni e territori progettati come un unico ambiente.",
      "b6.t": "Expertise in progetti unici",
      "b6.d": "Progetti ambiziosi e complessi in collaborazione con studi di livello mondiale, compresi i beni storici.",
      "trust.title": "02 / FIDUCIA",
      "trust.lead": "Numeri e fatti",
      "n.projects": "progetti realizzati",
      "n.years": "anni di professione",
      "n.contests": "concorsi e festival",
      "awards.title": "Premi e riconoscimenti",
      "a1": "1° premio — concorso nazionale aperto per concept di riqualificazione dello spazio pubblico",
      "a2": "Grand Prix — festival d'arte «Tolmachi»",
      "a3": "Short-list — Technopark Skolkovo",
      "a4": "Short-list — case modulari nell'eco-parco «Yasno-Pole»",
      "a5": "Espositore a «Sezione Aurea» e «Zodchestvo»",
      "projects.title": "Progetti chiave",
      "p1": "Centro di ricerca del MIPT, Dolgoprudny",
      "p2": "Residenze urbane e di campagna, villaggi cottage",
      "p3": "Sviluppo territoriale: piazze, parchi, lungofiume",
      "p4": "Edifici pubblici e strutture sanitarie",
      "p5": "Proprietà private: Roma, Antibes, Jurmala, Friburgo",
      "p6": "Concorsi: biblioteca di Varna, London National Park City, VYKSA 10000",
      "showcase.title": "03 / PROGETTO IN EVIDENZA",
      "showcase.lead": "Centro di ricerca del MIPT, Dolgoprudny",
      "form.title": "04 / PARLIAMO DEL VOSTRO PROGETTO",
      "form.sub": "Descrivete il compito — risposta entro un giorno lavorativo.",
      "f.name": "Nome",
      "f.name.ph": "Come chiamarvi",
      "f.contact": "Contatto",
      "f.contact.ph": "Telefono o e-mail",
      "f.msg": "Il compito",
      "f.msg.ph": "Tipo di edificio, sito, tempi — in poche parole",
      "f.submit": "Invia la richiesta",
      "f.note": "Il clic apre la vostra mail con una lettera pronta — il sito non conserva nulla.",
      "f.mail.subject": "Richiesta dal sito",
      "contacts.title": "Contatti",
      "c.phone": "Telefono",
      "c.email": "E-mail",
      "c.city": "Città",
      "c.city.value": "Mosca",
      "footer.tag": "Progettazione architettonica"
    }
  };

  var LANGS = ["ru", "en", "fr", "it"];

  /* ---------- Переключение языка ---------- */
  function setLang(lang) {
    if (!I18N[lang]) lang = "ru";
    var dict = I18N[lang];

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-ph");
      if (dict[key]) el.setAttribute("placeholder", dict[key]);
    });

    document.documentElement.lang = lang;
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
  }

  document.querySelectorAll(".lang-switch button").forEach(function (b) {
    b.addEventListener("click", function () {
      setLang(b.getAttribute("data-lang"));
      // запоминаем выбор только при ручном переключении
      try { localStorage.setItem("vc-lang", b.getAttribute("data-lang")); } catch (e) { /* приватный режим */ }
    });
  });

  // Статические языковые версии (/en/, /fr/, /it/) задают язык атрибутом
  // data-pinned-lang на <html> — он имеет приоритет над localStorage/браузером.
  // После первого ручного переключения пин снимается.
  var pinned = document.documentElement.getAttribute("data-pinned-lang");

  var saved = null;
  if (pinned && I18N[pinned]) {
    saved = pinned;
    document.documentElement.removeAttribute("data-pinned-lang");
  } else {
    try { saved = localStorage.getItem("vc-lang"); } catch (e) { /* ignore */ }
    if (!saved) {
      // язык браузера, если он среди поддерживаемых
      var nav = (navigator.language || "").slice(0, 2).toLowerCase();
      saved = LANGS.indexOf(nav) !== -1 ? nav : "ru";
    }
  }
  setLang(saved);

  /* ---------- Форма → mailto ---------- */
  document.getElementById("request-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    var lang = document.documentElement.lang || "ru";
    var subject = I18N[lang]["f.mail.subject"];
    var lines = [
      (I18N[lang]["f.name"] || "Name") + ": " + f.name.value,
      (I18N[lang]["f.contact"] || "Contact") + ": " + f.contact.value,
      "",
      f.message.value
    ];
    var href = "mailto:" + FORM_EMAIL +
      "?subject=" + encodeURIComponent(subject + (f.name.value ? " — " + f.name.value : "")) +
      "&body=" + encodeURIComponent(lines.join("\n"));
    window.location.href = href;
  });

  /* ---------- Анимация появления ---------- */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(function (el) { revealObs.observe(el); });

  /* ---------- Счётчики цифр ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var t0 = null, dur = 1400;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var numObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        numObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll(".num-value").forEach(function (el) { numObs.observe(el); });

  /* ---------- Год в футере ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
