(function () {
  "use strict";
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var filters = document.querySelectorAll("[data-filter]");
  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      var category = button.getAttribute("data-filter");
      filters.forEach(function (item) {
        item.setAttribute("aria-pressed", String(item === button));
      });
      document.querySelectorAll(".equipment-card").forEach(function (card) {
        card.hidden = category !== "all" && card.getAttribute("data-category") !== category;
      });
    });
  });
  document.querySelectorAll("[data-rail]").forEach(function (button) {
    button.addEventListener("click", function () {
      var rail = document.getElementById(button.getAttribute("data-rail"));
      if (!rail) return;
      var direction = Number(button.getAttribute("data-direction"));
      rail.scrollBy({ left: (rail.firstElementChild.getBoundingClientRect().width + 24) * direction, behavior: reducedMotion.matches ? "instant" : "smooth" });
    });
  });
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".equipment-card, .partner-tile, .why-image, .project-panel").forEach(function (item, index) {
      item.classList.add("reveal");
      item.style.transitionDelay = (index % 3) * 70 + "ms";
      observer.observe(item);
    });
  }
})();
