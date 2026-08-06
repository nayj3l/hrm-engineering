(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Portfolio filters
  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category]");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(btn => btn.classList.toggle("is-active", btn === button));

      cards.forEach(card => {
        const match = filter === "all" || card.dataset.category === filter;
        card.hidden = !match;
      });
    });
  });

  // Contact form (local demo — opens mailto with form values)
  const form = document.querySelector("#contact-form");
  const success = document.querySelector("#form-success");

  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const subject = String(data.get("subject") || "").trim();
      const message = String(data.get("message") || "").trim();

      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Inquiry type: ${subject}`,
        "",
        message
      ].join("\n");

      const mailto = `mailto:ed@hrmengineering.com?subject=${encodeURIComponent(
        `Website inquiry: ${subject}`
      )}&body=${encodeURIComponent(body)}`;

      // Demo behavior for local review — no backend yet
      window.location.href = mailto;

      if (success) {
        success.classList.add("is-visible");
        success.textContent =
          "Thanks — your email client should open with this inquiry ready to send.";
      }

      form.reset();
    });
  }
})();
