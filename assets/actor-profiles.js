(() => {
  const profiles = [
    { slug: "yuriy-kolokolnikov", first: "Юрий", last: "Колокольников", newsFirst: "Юрия", newsFull: "Юрия Колокольникова", menu: "Колокольников Юрий", gender: "m", age: "45 лет", birthday: "15 декабря 1980", height: "198 см", image: "actor_kolokolnikov.jpg", portrait: "portrait_main.jpg", rich: true, summary: "Актер театра и кино. Более 70 проектов, среди которых \"Игра престолов\", \"Тенет\", \"Последний Ронин\" и \"Мастер и Маргарита\"." },
    { slug: "anna-ukolova", first: "Анна", last: "Уколова", menu: "Уколова Анна", gender: "f", age: "48 лет", height: "181 см", image: "actor_ukolova.jpg" },
    { slug: "aleksandr-golovin", first: "Александр", last: "Головин", menu: "Головин Александр", gender: "m", age: "37 лет", height: "171 см", image: "actor_golovin.jpg" },
    { slug: "aleksandra-florinskaya", first: "Александра", last: "Флоринская", menu: "Флоринская Александра", gender: "f", age: "48 лет", height: "182 см", image: "actor_florinskaya.jpg" },
    { slug: "vladimir-verevochkin", first: "Владимир", last: "Веревочкин", menu: "Веревочкин Владимир", gender: "m", age: "38 лет", height: "176 см", image: "actor_verevochkin.jpg" },
    { slug: "evgeniy-mikheev", first: "Евгений", last: "Михеев", menu: "Михеев Евгений", gender: "m", age: "28 лет", height: "166 см", image: "actor_mixeev.jpg" },
    { slug: "matvey-baryshev", first: "Матвей", last: "Барышев", menu: "Барышев Матвей", gender: "m", age: "22 года", height: "185 см", image: "actor_baryshev.jpg" },
    { slug: "pavel-rassomakhin", first: "Павел", last: "Рассомахин", menu: "Рассомахин Павел", gender: "m", age: "33 года", height: "170 см", image: "actor_rassomakhin.jpg" },
    { slug: "efim-belosorochka", first: "Ефим", last: "Белосорочка", menu: "Белосорочка Ефим", gender: "m", age: "28 лет", height: "191 см", image: "actor_belosorochka.jpg" },
    { slug: "margarita-galich", first: "Маргарита", last: "Галич", menu: "Галич Маргарита", gender: "f", age: "26 лет", height: "164 см", image: "actor_galich.jpg" },
    { slug: "anastasiya-mishina", first: "Анастасия", last: "Мишина", menu: "Мишина Анастасия", gender: "f", age: "32 года", height: "175 см", image: "actor_mishina.jpg" },
    { slug: "vladislav-miller", first: "Владислав", last: "Миллер", menu: "Миллер Владислав", gender: "m", age: "27 лет", height: "178 см", image: "actor_miller.jpg" },
    { slug: "andrey-nazimov", first: "Андрей", last: "Назимов", menu: "Назимов Андрей", gender: "m", age: "39 лет", height: "190 см", image: "actor_nazimov.jpg" },
    { slug: "ilya-antonenko", first: "Илья", last: "Антоненко", menu: "Антоненко Илья", gender: "m", age: "36 лет", height: "173 см", image: "actor_antonenko.jpg" },
    { slug: "larisa-domaskina", first: "Лариса", last: "Домаскина", menu: "Домаскина Лариса", gender: "f", age: "59 лет", height: "167 см", image: "actor_domaskina.jpg" },
    { slug: "daniil-savelev", first: "Даниил", last: "Савельев", menu: "Савельев Даниил", gender: "m", age: "22 года", height: "182 см", image: "actor_savelyev.jpg" },
  ];

  const bySlug = new Map(profiles.map(profile => [profile.slug, profile]));
  const byName = new Map();
  profiles.forEach(profile => {
    byName.set(`${profile.first} ${profile.last}`, profile);
    byName.set(profile.menu, profile);
  });

  document.querySelectorAll('a[href^="profile.html"]').forEach(link => {
    const label = (link.querySelector(".cap b")?.textContent || link.textContent).trim();
    const profile = byName.get(label);
    if (profile) link.href = `profile.html?actor=${profile.slug}`;
  });

  const actorFilter = new URLSearchParams(window.location.search).get("actor");
  if (document.body.classList.contains("news-page") && actorFilter) {
    const actor = bySlug.get(actorFilter);
    if (actor) {
      const actorName = `${actor.first} ${actor.last}`;
      const heading = document.querySelector(".head .h1");
      const lead = document.querySelector(".head .lead");
      if (heading) heading.innerHTML = `Новости <b>${actor.newsFirst || actor.first}</b>`;
      if (lead) {
        lead.textContent = `Все публикации агентства с участием ${actor.newsFull || actorName}. `;
        const allNews = document.createElement("a");
        allNews.href = "news.html";
        allNews.textContent = "Показать все новости";
        lead.appendChild(allNews);
      }
      document.querySelectorAll(".newsgrid .ncard").forEach(card => {
        card.hidden = card.querySelector(".ntag")?.textContent.trim() !== actorName;
      });
      document.title = `Новости ${actorName} - Grechishkino`;
    }
  }

  const intro = document.querySelector(".profile-intro");
  if (!intro) return;

  const requestedSlug = new URLSearchParams(window.location.search).get("actor") || "yuriy-kolokolnikov";
  const profile = bySlug.get(requestedSlug) || bySlug.get("yuriy-kolokolnikov");
  const fullName = `${profile.first} ${profile.last}`;
  const role = profile.gender === "f" ? "Актриса" : "Актер";

  document.body.dataset.actor = profile.slug;
  document.title = `${fullName} - Grechishkino`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", `${fullName}, ${role.toLowerCase()} агентства Grechishkino.`);

  const portrait = intro.querySelector(".profile-portrait");
  portrait.src = `assets/${profile.portrait || profile.image}`;
  portrait.alt = fullName;
  intro.querySelector("h1").innerHTML = `${profile.first} <span>${profile.last}</span>`;
  intro.querySelector(".profile-summary").textContent = profile.summary || `${role} агентства Grechishkino.`;

  const facts = [...intro.querySelectorAll(".profile-fact")];
  facts[0].querySelector("dd").textContent = profile.age;
  facts[1].querySelector("dd").textContent = profile.birthday || "";
  facts[1].hidden = !profile.birthday;
  facts[2].querySelector("dd").textContent = profile.height;

  const requestButton = intro.querySelector(".profile-actions .btn.primary");
  requestButton.textContent = profile.gender === "f" ? "Запросить актрису" : "Запросить актера";
  const downloadButton = intro.querySelector(".profile-actions .btn.ghost");
  if (downloadButton) {
    downloadButton.href = `assets/${profile.portrait || profile.image}`;
    downloadButton.download = `${profile.slug}.jpg`;
  }
  const actorNewsLink = document.querySelector("#actor-news .sec-note a");
  if (actorNewsLink) {
    actorNewsLink.href = `news.html?actor=${profile.slug}`;
    actorNewsLink.textContent = `Все новости ${profile.newsFirst || profile.first}`;
  }

  if (!profile.rich) {
    document.body.classList.add("profile-page--limited");
    intro.querySelector(".profile-actions .btn.ghost").hidden = true;
    intro.querySelector(".profile-links").hidden = true;
    document.querySelector(".profile-jump-nav").hidden = true;
    document.querySelectorAll("#photos, #video, .role-strip, #filmography, .role-gallery, #actor-news").forEach(section => { section.hidden = true; });

    const footerTitle = document.querySelector("#contact .f-cta h2");
    const footerText = document.querySelector("#contact .f-cta p");
    if (footerTitle) footerTitle.textContent = profile.gender === "f" ? "Пригласить актрису на проект" : "Пригласить актера на проект";
    if (footerText) footerText.textContent = `${fullName} представлен${profile.gender === "f" ? "а" : ""} агентством Grechishkino.`;
  }

  document.querySelectorAll("#more .acard").forEach(card => {
    if (card.querySelector(".cap b")?.textContent.trim() === fullName) card.hidden = true;
  });
})();

// Кнопка "Наверх": общая для всех страниц, появляется после первого экрана.
(() => {
  const btn = document.createElement("button");
  btn.className = "to-top";
  btn.type = "button";
  btn.setAttribute("aria-label", "Наверх");
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(btn);
  const toggle = () => btn.classList.toggle("on", window.scrollY > window.innerHeight);
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
})();
