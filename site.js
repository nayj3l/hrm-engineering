(function () {
  const FORMSPREE_FORM_ID = "YOUR_FORM_ID";
  const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  const heroMedia = document.querySelector(".home-hero-media");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (heroMedia && !reduceMotion) {
    const shiftHero = () => {
      const y = Math.min(window.scrollY, 720);
      heroMedia.style.setProperty("--hero-shift", `${y * 0.22}px`);
    };
    window.addEventListener("scroll", shiftHero, { passive: true });
    shiftHero();
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

  const filterButtons = document.querySelectorAll("[data-filter]");
  const groups = document.querySelectorAll(".work-group");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(btn => btn.classList.toggle("is-active", btn === button));

      groups.forEach(group => {
        const match = filter === "all" || group.dataset.category === filter;
        group.hidden = !match;
      });
    });
  });

  const form = document.querySelector("#contact-form");
  const success = document.querySelector("#form-success");
  const error = document.querySelector("#form-error");

  if (form) {
    form.addEventListener("submit", async event => {
      event.preventDefault();

      if (success) {
        success.classList.remove("is-visible");
        success.textContent = "";
      }
      if (error) {
        error.classList.remove("is-visible");
        error.textContent = "";
      }

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const subject = String(data.get("subject") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (!name || !email || !subject || !message) {
        if (error) {
          error.classList.add("is-visible");
          error.textContent = "Please complete all fields before sending.";
        }
        return;
      }

      const payload = new FormData();
      payload.set("name", name);
      payload.set("email", email);
      payload.set("_replyto", email);
      payload.set("subject", subject);
      payload.set("_subject", `Website inquiry: ${subject}`);
      payload.set("message", message);

      const showError = () => {
        if (error) {
          error.classList.add("is-visible");
          error.textContent =
            "Unable to send right now. Please email info@hrmengineering.com.";
        }
      };

      if (!FORMSPREE_FORM_ID || FORMSPREE_FORM_ID === "YOUR_FORM_ID") {
        showError();
        return;
      }

      const submitButton = form.querySelector("button[type='submit']");
      if (submitButton) submitButton.disabled = true;

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: payload
        });

        if (!response.ok) {
          showError();
          return;
        }

        form.reset();
        form.hidden = true;
        if (success) {
          success.classList.add("is-visible");
          success.textContent =
            "Your inquiry was received. Someone from HRM will follow up.";
        }
      } catch (err) {
        showError();
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }
})();
