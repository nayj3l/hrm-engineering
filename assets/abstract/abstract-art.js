(function () {
  const PALETTE = {
    deep: ["#08101b", "#1c2d59", "#2e338a"],
    mid: ["#2e338a", "#437cc0", "#6ba3d4"],
    light: ["#437cc0", "#7eb8e8", "#c2e3f4"],
    glow: ["#ffffff", "#c2e3f4", "#437cc0"],
  };

  const VARIANTS = {
    hero: { colors: [PALETTE.deep, PALETTE.mid, PALETTE.light], speed: 0.00035, grid: true, particles: 28 },
    ember: { colors: [PALETTE.mid, PALETTE.light, PALETTE.glow], speed: 0.0005, grid: true, particles: 16 },
    pulse: { colors: [PALETTE.deep, PALETTE.mid, PALETTE.light], speed: 0.00065, grid: false, particles: 12 },
    spark: { colors: [PALETTE.mid, PALETTE.light, PALETTE.glow], speed: 0.0008, grid: true, particles: 10 },
    vista: { colors: [PALETTE.deep, PALETTE.mid, PALETTE.light], speed: 0.0004, grid: true, particles: 22 },
    deep: { colors: [PALETTE.deep, PALETTE.mid, PALETTE.light], speed: 0.0003, grid: true, particles: 20 },
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function hashSeed(seed) {
    const x = Math.sin(seed * 127.1) * 43758.5453;
    return x - Math.floor(x);
  }

  class AbstractArt {
    constructor(element) {
      this.el = element;
      this.variant = VARIANTS[element.dataset.variant] || VARIANTS.ember;
      this.seed = Number.parseFloat(element.dataset.seed || "1");
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.el.appendChild(this.canvas);

      this.mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
      this.time = this.seed * 1000;
      this.running = true;
      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.blobs = this.createBlobs();
      this.particles = this.createParticles();

      this.onMove = this.onMove.bind(this);
      this.onResize = this.onResize.bind(this);
      this.tick = this.tick.bind(this);

      window.addEventListener("mousemove", this.onMove, { passive: true });
      window.addEventListener("resize", this.onResize, { passive: true });

      this.onResize();
      requestAnimationFrame(this.tick);
    }

    createBlobs() {
      return Array.from({ length: 4 }, (_, index) => {
        const h1 = hashSeed(this.seed + index * 1.7);
        const h2 = hashSeed(this.seed + index * 2.3 + 4);
        const h3 = hashSeed(this.seed + index * 3.1 + 8);
        return {
          x: 0.15 + h1 * 0.7,
          y: 0.15 + h2 * 0.7,
          radius: 0.22 + h3 * 0.28,
          drift: 0.35 + h1 * 0.45,
          phase: h2 * Math.PI * 2,
          colorSet: this.variant.colors[index % this.variant.colors.length],
        };
      });
    }

    createParticles() {
      const count = this.variant.particles;
      return Array.from({ length: count }, (_, index) => {
        const h = hashSeed(this.seed * 9 + index * 0.61);
        return {
          x: hashSeed(index + this.seed),
          y: hashSeed(index * 2 + this.seed),
          size: 0.8 + h * 2.4,
          speed: 0.2 + h * 0.8,
          alpha: 0.12 + h * 0.35,
        };
      });
    }

    onMove(event) {
      const rect = this.el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      const nx = (event.clientX - rect.left) / rect.width;
      const ny = (event.clientY - rect.top) / rect.height;
      this.mouse.tx = clamp(nx, -0.35, 1.35);
      this.mouse.ty = clamp(ny, -0.35, 1.35);
    }

    onResize() {
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = Math.max(1, Math.round(this.el.clientWidth));
      this.height = Math.max(1, Math.round(this.el.clientHeight));
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    drawBackground(ctx) {
      const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
      gradient.addColorStop(0, this.variant.colors[0][0]);
      gradient.addColorStop(0.55, this.variant.colors[0][1]);
      gradient.addColorStop(1, this.variant.colors[0][2] || this.variant.colors[1][1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    drawBlobs(ctx) {
      const parallaxX = (this.mouse.x - 0.5) * 0.18;
      const parallaxY = (this.mouse.y - 0.5) * 0.18;

      this.blobs.forEach((blob, index) => {
        const driftX = Math.sin(this.time * blob.drift + blob.phase) * 0.07;
        const driftY = Math.cos(this.time * blob.drift * 0.9 + blob.phase) * 0.06;
        const x = (blob.x + driftX + parallaxX * (0.6 + index * 0.15)) * this.width;
        const y = (blob.y + driftY + parallaxY * (0.6 + index * 0.15)) * this.height;
        const radius = blob.radius * Math.min(this.width, this.height);
        const [c1, c2, c3] = blob.colorSet;
        const radial = ctx.createRadialGradient(x, y, 0, x, y, radius);
        radial.addColorStop(0, c3 + "cc");
        radial.addColorStop(0.45, c2 + "88");
        radial.addColorStop(1, c1 + "00");
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    drawGrid(ctx) {
      if (!this.variant.grid) {
        return;
      }

      const spacing = Math.max(28, Math.min(this.width, this.height) / 14);
      const offsetX = (this.mouse.x - 0.5) * spacing * 0.8;
      const offsetY = (this.mouse.y - 0.5) * spacing * 0.8;

      ctx.strokeStyle = "rgba(194, 227, 244, 0.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let x = -spacing; x < this.width + spacing; x += spacing) {
        const lineX = x + offsetX;
        ctx.moveTo(lineX, 0);
        ctx.lineTo(lineX, this.height);
      }

      for (let y = -spacing; y < this.height + spacing; y += spacing) {
        const lineY = y + offsetY;
        ctx.moveTo(0, lineY);
        ctx.lineTo(this.width, lineY);
      }

      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.moveTo(0, this.height * 0.62 + offsetY * 0.2);
      ctx.lineTo(this.width, this.height * 0.38 - offsetY * 0.2);
      ctx.stroke();
    }

    drawParticles(ctx) {
      this.particles.forEach((particle, index) => {
        const px =
          ((particle.x + Math.sin(this.time * particle.speed + index) * 0.04 + (this.mouse.x - 0.5) * 0.05) %
            1) *
          this.width;
        const py =
          ((particle.y + Math.cos(this.time * particle.speed * 1.1 + index) * 0.04 + (this.mouse.y - 0.5) * 0.05) %
            1) *
          this.height;

        ctx.fillStyle = `rgba(194, 227, 244, ${particle.alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    drawSheen(ctx) {
      const sheenX = this.width * lerp(0.25, 0.75, this.mouse.x);
      const sheenY = this.height * lerp(0.2, 0.8, this.mouse.y);
      const sheen = ctx.createRadialGradient(sheenX, sheenY, 0, sheenX, sheenY, this.width * 0.55);
      sheen.addColorStop(0, "rgba(255, 255, 255, 0.16)");
      sheen.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, this.width, this.height);
    }

    tick(timestamp) {
      if (!this.running) {
        return;
      }

      this.time = timestamp * this.variant.speed;
      this.mouse.x = lerp(this.mouse.x, this.mouse.tx, 0.06);
      this.mouse.y = lerp(this.mouse.y, this.mouse.ty, 0.06);

      const { ctx } = this;
      ctx.clearRect(0, 0, this.width, this.height);
      this.drawBackground(ctx);
      this.drawBlobs(ctx);
      this.drawGrid(ctx);
      this.drawParticles(ctx);
      this.drawSheen(ctx);

      requestAnimationFrame(this.tick);
    }
  }

  function initAbstractArt() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    document.querySelectorAll("[data-abstract-art]").forEach(element => {
      new AbstractArt(element);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAbstractArt);
  } else {
    initAbstractArt();
  }
})();
