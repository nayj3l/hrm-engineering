(function () {
  const glyphs = document.querySelector(".maintenance-glyphs");
  if (!glyphs || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener(
    "mousemove",
    event => {
      const nx = (event.clientX / window.innerWidth - 0.5) * 2;
      const ny = (event.clientY / window.innerHeight - 0.5) * 2;
      targetX = nx * 18;
      targetY = ny * 14;
    },
    { passive: true }
  );

  function tick() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    glyphs.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentX * 0.08}deg)`;
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
