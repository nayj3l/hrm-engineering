
function animateValue(node, start, end, duration, suffix = "") {
  let startTimestamp = null;

  const step = timestamp => {
    if (!startTimestamp) {
      startTimestamp = timestamp;
    }

    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    node.textContent = Math.floor(progress * (end - start) + start) + suffix;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}

function initializeLegacyHighlights() {
  const highlights = document.querySelectorAll(".highlight");
  if (highlights.length === 0 || typeof IntersectionObserver !== "function") {
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }

      highlights.forEach((highlight, index) => {
        if (highlight.dataset.animated === "true") {
          return;
        }

        const target = Number.parseInt(highlight.textContent, 10);
        if (Number.isNaN(target)) {
          return;
        }

        const durations = [2800, 2000, 1000];
        const suffix = index < 2 ? "+" : "";
        highlight.dataset.animated = "true";
        animateValue(highlight, 0, target, durations[index] || 1400, suffix);
      });

      observer.disconnect();
    });
  }, {
    rootMargin: "0px",
    threshold: 0.3,
  });

  observer.observe(highlights[0]);
}

function typeHeroTitleLoop(node, text) {
  if (!node || node.dataset.typingLoop === "true") {
    return;
  }

  node.dataset.typingLoop = "true";
  node.classList.add("is-typing");

  let index = 0;
  let deleting = false;

  const step = () => {
    if (!node.isConnected) {
      return;
    }

    if (!deleting) {
      index += 1;
      node.textContent = text.slice(0, index);

      if (index < text.length) {
        const cadence = index < 4 ? 95 : 72;
        window.setTimeout(step, cadence);
        return;
      }

      deleting = true;
      window.setTimeout(step, 1400);
      return;
    }

    index -= 1;
    node.textContent = text.slice(0, index);

    if (index > 0) {
      window.setTimeout(step, 46);
      return;
    }

    deleting = false;
    window.setTimeout(step, 420);
  };

  node.textContent = "";
  window.setTimeout(step, 180);
}

function initializeHomeHeroAnimation() {
  const homePage = document.querySelector("body.page-home");
  if (!homePage) {
    return;
  }

  const engineering = homePage.querySelector(".hero-title--engineering");
  if (!engineering) {
    return;
  }

  const fullText = (engineering.dataset.text || engineering.textContent || "").trim();
  if (!fullText) {
    return;
  }

  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const prefersStaticTitle = prefersReducedMotion || (window.matchMedia && window.matchMedia("(max-width: 760px)").matches);
  if (prefersStaticTitle) {
    engineering.textContent = fullText;
    return;
  }

  let started = false;
  const startTyping = () => {
    if (started) {
      return;
    }

    started = true;
    typeHeroTitleLoop(engineering, fullText);
  };

  engineering.textContent = "";
  engineering.addEventListener("animationend", event => {
    if (event.animationName === "slide-in-right") {
      startTyping();
    }
  }, { once: true });
  window.setTimeout(startTyping, 1400);
}

function initializeIntroAnimations() {
  initializeLegacyHighlights();
  initializeHomeHeroAnimation();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeIntroAnimations, { once: true });
} else {
  initializeIntroAnimations();
}