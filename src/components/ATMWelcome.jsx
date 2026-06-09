
import { useEffect, useRef, useState } from "react";import * as THREE from "three";
import "./styles.css";
import { useNavigate } from "react-router-dom";

const ATMWelcome = () => {
  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const cardStreamRef = useRef(null);
  const cardLineRef = useRef(null);
  const speedValueRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const scannerCanvasRef = useRef(null);
  const insertBtnRef = useRef(null);

  useEffect(() => {
    class CardStreamController {
      constructor() {
        this.container = cardStreamRef.current;
        this.cardLine = cardLineRef.current;
if (this.speedEl) {
  this.speedEl.textContent = "";
}
        this.position = 150;
        this.velocity = 0;
        this.direction = 1;
        this.isAnimating = true;
        this.isDragging = false;

        this.lastTime = performance.now();
        this.lastMouseY = 0;
        this.friction = 0.95;
        this.minVelocity = 0;

        this.containerHeight = 0;
        this.cardLineHeight = 0;

        this.init();
      }

      init() {
        this.populateCardLine();
        this.calculateDimensions();
        this.setupEventListeners();
        this.updateCardPosition();
        this.animate();
        this.startPeriodicUpdates();
      }

      calculateDimensions() {
        this.containerHeight = window.innerHeight;
        const cardHeight = 250;
        const cardGap = 60;
        const cardCount = this.cardLine.children.length;
        this.cardLineHeight = (cardHeight + cardGap) * cardCount;
      }

      setupEventListeners() {
        this.cardLine.addEventListener("mousedown", (e) =>
          this.startDrag(e)
        );

        document.addEventListener("mousemove", (e) => this.onDrag(e));

        document.addEventListener("mouseup", () => this.endDrag());

        this.cardLine.addEventListener(
          "touchstart",
          (e) => this.startDrag(e.touches[0]),
          { passive: false }
        );

        document.addEventListener(
          "touchmove",
          (e) => this.onDrag(e.touches[0]),
          { passive: false }
        );

        document.addEventListener("touchend", () => this.endDrag());

        this.cardLine.addEventListener("wheel", (e) => this.onWheel(e));

        this.cardLine.addEventListener("selectstart", (e) =>
          e.preventDefault()
        );

        this.cardLine.addEventListener("dragstart", (e) =>
          e.preventDefault()
        );

        window.addEventListener("resize", () =>
          this.calculateDimensions()
        );
      }

      startDrag(e) {
        e.preventDefault();

        this.isDragging = true;
        this.isAnimating = false;
        this.lastMouseY = e.clientY;

        const transform = window.getComputedStyle(this.cardLine).transform;

        if (transform !== "none") {
          this.position = new DOMMatrix(transform).m42;
        }

        this.cardLine.classList.add("dragging");

        document.body.style.userSelect = "none";
        document.body.style.cursor = "grabbing";
      }

      onDrag(e) {
        if (!this.isDragging) return;

        e.preventDefault();

        const deltaY = e.clientY - this.lastMouseY;

        this.position += deltaY;
        this.lastMouseY = e.clientY;

        this.cardLine.style.transform = `translateY(${this.position}px)`;

        this.updateCardClipping();
      }

      endDrag() {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.isAnimating = false;

        this.cardLine.classList.remove("dragging");

        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      }

      animate() {
        const now = performance.now();
        const deltaTime = (now - this.lastTime) / 1000;

        this.lastTime = now;

        if (this.isAnimating && !this.isDragging) {
  this.velocity = Math.max(this.minVelocity, this.velocity);

  this.position +=
    this.velocity * this.direction * deltaTime;

  this.updateCardPosition();
}

this.animationFrame =
  requestAnimationFrame(() => this.animate());      }

      updateCardPosition() {
        const h = this.cardLineHeight;
        const w = this.containerHeight;

        if (this.position < -h) this.position = w;
        if (this.position > w) this.position = -h;

        this.cardLine.style.transform = `translateY(${this.position}px)`;

        this.updateCardClipping();
      }

      onWheel(e) {
        e.preventDefault();

        this.position += e.deltaY > 0 ? 20 : -20;

        this.updateCardPosition();
      }

      updateCardClipping() {
        const scannerY = window.innerHeight / 2;
        const scannerHeight = 8;

        const scanTop = scannerY - scannerHeight / 2;
        const scanBottom = scannerY + scannerHeight / 2;

        let anyScanningActive = false;

        document.querySelectorAll(".card-wrapper").forEach((wrapper) => {
          const rect = wrapper.getBoundingClientRect();

          const cardTop = rect.top;
          const cardBottom = rect.bottom;
          const cardHeight = rect.height;

          const normalCard =
            wrapper.querySelector(".card-normal");

          const asciiCard =
            wrapper.querySelector(".card-ascii");

            const btn = insertBtnRef.current;

if (!normalCard || !asciiCard || !btn) {
  return;
}

          if (
            cardTop < scanBottom &&
            cardBottom > scanTop
          ) {
            anyScanningActive = true;

            const intersectTop = Math.max(
              scanTop - cardTop,
              0
            );

            const intersectBottom = Math.min(
              scanBottom - cardTop,
              cardHeight
            );

            const clipTop =
              (intersectTop / cardHeight) * 100;

            const clipBottom =
              (intersectBottom / cardHeight) * 100;

            normalCard.style.setProperty(
              "--clip-top",
              `${clipTop}%`
            );

            asciiCard.style.setProperty(
              "--clip-bottom",
              `${clipBottom}%`
            );

            if (
              !wrapper.hasAttribute("data-scanned") &&
              intersectTop > 0
            ) {
              wrapper.setAttribute("data-scanned", "true");

              const fx = document.createElement("div");

              fx.style.cssText = `
                position:absolute;
                top:0;
                left:0;
                width:100%;
                height:100%;
                background:linear-gradient(
                  180deg,
                  transparent,
                  rgba(0,255,255,0.4),
                  transparent
                );
                animation:scanEffectV 0.6s ease-out;
                pointer-events:none;
                z-index:5;
              `;

              wrapper.appendChild(fx);

              setTimeout(() => {
                fx.parentNode &&
                  fx.parentNode.removeChild(fx);
              }, 600);
            }
          } else {
            if (cardBottom < scanTop) {
              btn.style.display = "block";

              normalCard.style.setProperty(
                "--clip-top",
                "100%"
              );

              asciiCard.style.setProperty(
                "--clip-bottom",
                "0%"
              );
            } else {
              btn.style.display = "none";

              normalCard.style.setProperty(
                "--clip-top",
                "0%"
              );

              asciiCard.style.setProperty(
                "--clip-bottom",
                "100%"
              );
            }

            wrapper.removeAttribute("data-scanned");
          }
        });

        if (window.setScannerScanning) {
          window.setScannerScanning(anyScanningActive);
        }
      }

      generateCode(width, height) {
        let flow = "";

        const total = width * height;

        while (flow.length < total) {
          flow += Math.random() > 0.5 ? "1" : "0";
        }

        let out = "";
        let offset = 0;

        for (let row = 0; row < height; row++) {
          let line = flow.slice(offset, offset + width);

          if (line.length < width) {
            line = line.padEnd(width, "0");
          }

          out += line + (row < height - 1 ? "\n" : "");

          offset += width;
        }

        return out;
      }

      calculateCodeDimensions(w, h) {
        return {
          width: Math.floor(w / 6),
          height: Math.floor(h / 13),
          fontSize: 11,
          lineHeight: 13,
        };
      }

      createCardWrapper() {
        const wrapper = document.createElement("div");

        wrapper.className = "card-wrapper";

        const normalCard = document.createElement("div");

        normalCard.className = "card card-normal";

        const img = document.createElement("img");

        img.className = "card-image";

        img.src =
          "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b55e654d1341fb06f8_4.1.png";

        img.alt = "Credit Card";

        normalCard.appendChild(img);

        const asciiCard = document.createElement("div");

        asciiCard.className = "card card-ascii";

        const asciiContent = document.createElement("div");

        asciiContent.className = "ascii-content";

        const {
          width,
          height,
          fontSize,
          lineHeight,
        } = this.calculateCodeDimensions(400, 250);

        asciiContent.style.fontSize = fontSize + "px";

        asciiContent.style.lineHeight =
          lineHeight + "px";

        asciiContent.textContent =
          this.generateCode(width, height);

        asciiCard.appendChild(asciiContent);

        wrapper.appendChild(normalCard);
        wrapper.appendChild(asciiCard);

        return wrapper;
      }

      updateAsciiContent() {
        document.querySelectorAll(".ascii-content")
          .forEach((c) => {
            if (Math.random() < 0.15) {
              const { width, height } =
                this.calculateCodeDimensions(400, 250);

              c.textContent =
                this.generateCode(width, height);
            }
          });
      }

      populateCardLine() {
        this.cardLine.innerHTML = "";

        for (let i = 0; i < 1; i++) {
          this.cardLine.appendChild(
            this.createCardWrapper(i)
          );
        }
      }

      startPeriodicUpdates() {
        setInterval(() => this.updateAsciiContent(), 200);

        const loop = () => {
          this.updateCardClipping();

          requestAnimationFrame(loop);
        };

        loop();
      }
    }

    class ParticleSystem {
      constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;

        this.particleCount = 400;

        this.canvas = particleCanvasRef.current;

        this.init();
      }

      init() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(
          -200,
          200,
          window.innerHeight / 2,
          -window.innerHeight / 2,
          1,
          1000
        );

        this.camera.position.z = 100;

        this.renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          alpha: true,
          antialias: true,
        });

        this.renderer.setSize(400, window.innerHeight);

        this.renderer.setClearColor(0x000000, 0);

        this.createParticles();

        this.animate();

        window.addEventListener("resize", () =>
          this.onWindowResize()
        );
      }

      createParticles() {
        const geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(
          this.particleCount * 3
        );

        const colors = new Float32Array(
          this.particleCount * 3
        );

        const velocities = new Float32Array(
          this.particleCount
        );

        for (let i = 0; i < this.particleCount; i++) {
          positions[i * 3] =
            (Math.random() - 0.5) * 400;

          positions[i * 3 + 1] =
            (Math.random() - 0.5) *
            window.innerHeight;

          positions[i * 3 + 2] = 0;

          colors[i * 3] =
            colors[i * 3 + 1] =
            colors[i * 3 + 2] =
              1;

          velocities[i] = Math.random() * 60 + 30;
        }

        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );

        geometry.setAttribute(
          "color",
          new THREE.BufferAttribute(colors, 3)
        );

        this.velocities = velocities;

        const material = new THREE.PointsMaterial({
          color: 0x8b5cf6,
          size: 2,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
        });

        this.particles = new THREE.Points(
          geometry,
          material
        );

        this.scene.add(this.particles);
      }

      animate() {
        requestAnimationFrame(() => this.animate());

        if (this.particles) {
          const pos =
            this.particles.geometry.attributes.position
              .array;

          for (let i = 0; i < this.particleCount; i++) {
            pos[i * 3] += this.velocities[i] * 0.016;

            if (pos[i * 3] > 300) {
              pos[i * 3] = -300;

              pos[i * 3 + 1] =
                (Math.random() - 0.5) *
                window.innerHeight;
            }

            pos[i * 3 + 1] +=
              Math.sin(Date.now() * 0.001 + i) * 0.3;
          }

          this.particles.geometry.attributes.position.needsUpdate =
            true;
        }

        this.renderer.render(this.scene, this.camera);
      }

      onWindowResize() {
        this.camera.top = window.innerHeight / 2;

        this.camera.bottom =
          -window.innerHeight / 2;

        this.camera.updateProjectionMatrix();

        this.renderer.setSize(400, window.innerHeight);
      }
    }

  class ParticleScanner {
  constructor() {
    this.canvas = scannerCanvasRef.current;
    this.ctx = this.canvas.getContext("2d");

    this.w = 500;
    this.h = window.innerHeight;

    this.lightBarY = this.h / 2;
    this.lightBarWidth = 3;
    this.fadeZone = 60;

    this.intensity = 0.8;
    this.maxParticles = 800;
    this.baseIntensity = 0.8;
    this.baseMaxParticles = 800;
    this.baseFadeZone = 60;

    this.scanTargetIntensity = 1.8;
    this.scanTargetParticles = 2500;
    this.scanTargetFadeZone = 35;

    this.scanningActive = false;
    this.currentIntensity = this.intensity;
    this.currentMaxParticles = this.maxParticles;
    this.currentFadeZone = this.fadeZone;
    this.currentGlowIntensity = 1;
    this.transitionSpeed = 0.05;

    this.particles = [];
    this.count = 0;

    this.setupCanvas();
    this.createGradientCache();
    this.initParticles();
    this.animate();

    window.addEventListener("resize", () =>
      this.onResize()
    );
  }

  setupCanvas() {
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.canvas.style.width = this.w + "px";
    this.canvas.style.height = this.h + "px";
  }

  onResize() {
    this.h = window.innerHeight;
    this.lightBarY = this.h / 2;
    this.setupCanvas();
  }

  createGradientCache() {
    this.gradientCanvas = document.createElement("canvas");

    this.gradientCanvas.width = 16;
    this.gradientCanvas.height = 16;

    const ctx = this.gradientCanvas.getContext("2d");

    const half = 8;

    const g = ctx.createRadialGradient(
      half,
      half,
      0,
      half,
      half,
      half
    );

    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.3, "rgba(196,181,253,0.8)");
    g.addColorStop(0.7, "rgba(139,92,246,0.4)");
    g.addColorStop(1, "transparent");

    ctx.fillStyle = g;

    ctx.beginPath();

    ctx.arc(half, half, half, 0, Math.PI * 2);

    ctx.fill();
  }

  rf(min, max) {
    return Math.random() * (max - min) + min;
  }

  createParticle() {
    const ir =
      this.intensity / this.baseIntensity;

    const sm = 1 + (ir - 1) * 1.2;

    const sz = 1 + (ir - 1) * 0.7;

    return {
      x: this.rf(0, this.w),

      y:
        this.lightBarY +
        this.rf(
          -this.lightBarWidth / 2,
          this.lightBarWidth / 2
        ),

      vx: this.rf(-0.15, 0.15) * sm,

      vy: this.rf(0.2, 1.0) * sm,

      radius: this.rf(0.4, 1) * sz,

      alpha: this.rf(0.6, 1),

      decay:
        this.rf(0.005, 0.025) *
        (2 - ir * 0.5),

      originalAlpha: 0,

      life: 1.0,

      time: 0,

      twinkleSpeed:
        this.rf(0.02, 0.08) * sm,

      twinkleAmount: this.rf(0.1, 0.25),
    };
  }

  initParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.createParticle();

      p.originalAlpha = p.alpha;

      this.particles[++this.count] = p;
    }
  }

  updateParticle(p) {
    p.x += p.vx;

    p.y += p.vy;

    p.time++;

    p.alpha =
      p.originalAlpha * p.life +
      Math.sin(p.time * p.twinkleSpeed) *
        p.twinkleAmount;

    p.life -= p.decay;

    if (p.y > this.h + 10 || p.life <= 0) {
      this.resetParticle(p);
    }
  }

  resetParticle(p) {
    p.x = this.rf(0, this.w);

    p.y =
      this.lightBarY +
      this.rf(
        -this.lightBarWidth / 2,
        this.lightBarWidth / 2
      );

    p.vx = this.rf(-0.15, 0.15);

    p.vy = this.rf(0.2, 1.0);

    p.alpha = p.originalAlpha =
      this.rf(0.6, 1);

    p.life = 1.0;

    p.time = 0;
  }

  drawParticle(p) {
    if (p.life <= 0) return;

    let fade = 1;

    if (p.x < this.fadeZone) {
      fade = p.x / this.fadeZone;
    } else if (
      p.x > this.w - this.fadeZone
    ) {
      fade =
        (this.w - p.x) / this.fadeZone;
    }

    fade = Math.max(0, Math.min(1, fade));

    this.ctx.globalAlpha = p.alpha * fade;

    this.ctx.drawImage(
      this.gradientCanvas,
      p.x - p.radius,
      p.y - p.radius,
      p.radius * 2,
      p.radius * 2
    );
  }

  drawLightBar() {
    const ctx = this.ctx;

    const lw = this.lightBarWidth;

    const y = this.lightBarY;

    const hGrad =
      ctx.createLinearGradient(0, 0, this.w, 0);

    hGrad.addColorStop(
      0,
      "rgba(255,255,255,0)"
    );

    hGrad.addColorStop(
      this.fadeZone / this.w,
      "rgba(255,255,255,1)"
    );

    hGrad.addColorStop(
      1 - this.fadeZone / this.w,
      "rgba(255,255,255,1)"
    );

    hGrad.addColorStop(
      1,
      "rgba(255,255,255,0)"
    );

    ctx.globalCompositeOperation = "lighter";

    this.currentGlowIntensity +=
      (
        (this.scanningActive ? 3.5 : 1) -
        this.currentGlowIntensity
      ) * this.transitionSpeed;

    const gi = this.currentGlowIntensity;

    const coreG =
      ctx.createLinearGradient(
        0,
        y - lw / 2,
        0,
        y + lw / 2
      );

    coreG.addColorStop(
      0,
      "rgba(255,255,255,0)"
    );

    coreG.addColorStop(
      0.5,
      `rgba(255,255,255,${gi})`
    );

    coreG.addColorStop(
      1,
      "rgba(255,255,255,0)"
    );

    ctx.globalAlpha = 1;

    ctx.fillStyle = coreG;

    ctx.beginPath();

    ctx.roundRect(0, y - lw / 2, this.w, lw, 15);

    ctx.fill();

    const g1 =
      ctx.createLinearGradient(
        0,
        y - lw * 2,
        0,
        y + lw * 2
      );

    g1.addColorStop(
      0,
      "rgba(139,92,246,0)"
    );

    g1.addColorStop(
      0.5,
      `rgba(196,181,253,${0.8 * gi})`
    );

    g1.addColorStop(
      1,
      "rgba(139,92,246,0)"
    );

    ctx.globalAlpha =
      this.scanningActive ? 1.0 : 0.8;

    ctx.fillStyle = g1;

    ctx.beginPath();

    ctx.roundRect(
      0,
      y - lw * 2,
      this.w,
      lw * 4,
      25
    );

    ctx.fill();

    const g2 =
      ctx.createLinearGradient(
        0,
        y - lw * 4,
        0,
        y + lw * 4
      );

    g2.addColorStop(
      0,
      "rgba(139,92,246,0)"
    );

    g2.addColorStop(
      0.5,
      `rgba(139,92,246,${0.4 * gi})`
    );

    g2.addColorStop(
      1,
      "rgba(139,92,246,0)"
    );

    ctx.globalAlpha =
      this.scanningActive ? 0.8 : 0.6;

    ctx.fillStyle = g2;

    ctx.beginPath();

    ctx.roundRect(
      0,
      y - lw * 4,
      this.w,
      lw * 8,
      35
    );

    ctx.fill();

    if (this.scanningActive) {
      const g3 =
        ctx.createLinearGradient(
          0,
          y - lw * 8,
          0,
          y + lw * 8
        );

      g3.addColorStop(
        0,
        "rgba(139,92,246,0)"
      );

      g3.addColorStop(
        0.5,
        "rgba(139,92,246,0.2)"
      );

      g3.addColorStop(
        1,
        "rgba(139,92,246,0)"
      );

      ctx.globalAlpha = 0.6;

      ctx.fillStyle = g3;

      ctx.beginPath();

      ctx.roundRect(
        0,
        y - lw * 8,
        this.w,
        lw * 16,
        45
      );

      ctx.fill();
    }

    ctx.globalCompositeOperation =
      "destination-in";

    ctx.globalAlpha = 1;

    ctx.fillStyle = hGrad;

    ctx.fillRect(0, 0, this.w, this.h);
  }

  render() {
    const ti = this.scanningActive
      ? this.scanTargetIntensity
      : this.baseIntensity;

    const tp = this.scanningActive
      ? this.scanTargetParticles
      : this.baseMaxParticles;

    const tf = this.scanningActive
      ? this.scanTargetFadeZone
      : this.baseFadeZone;

    this.currentIntensity +=
      (ti - this.currentIntensity) *
      this.transitionSpeed;

    this.currentMaxParticles +=
      (tp - this.currentMaxParticles) *
      this.transitionSpeed;

    this.currentFadeZone +=
      (tf - this.currentFadeZone) *
      this.transitionSpeed;

    this.intensity = this.currentIntensity;

    this.maxParticles = Math.floor(
      this.currentMaxParticles
    );

    this.fadeZone = this.currentFadeZone;

    this.ctx.globalCompositeOperation =
      "source-over";

    this.ctx.clearRect(0, 0, this.w, this.h);

    this.drawLightBar();

    this.ctx.globalCompositeOperation =
      "lighter";

    for (let i = 1; i <= this.count; i++) {
      if (this.particles[i]) {
        this.updateParticle(this.particles[i]);

        this.drawParticle(this.particles[i]);
      }
    }

    const addParticle = () => {
      const p = this.createParticle();

      p.originalAlpha = p.alpha;

      this.particles[++this.count] = p;
    };

    if (
      Math.random() < this.intensity &&
      this.count < this.maxParticles
    ) {
      addParticle();
    }

    const ir =
      this.intensity / this.baseIntensity;

    if (
      ir > 1.1 &&
      Math.random() < (ir - 1.0) * 1.2
    ) {
      addParticle();
    }

    if (
      ir > 1.3 &&
      Math.random() < (ir - 1.3) * 1.4
    ) {
      addParticle();
    }

    if (
      ir > 1.5 &&
      Math.random() < (ir - 1.5) * 1.8
    ) {
      addParticle();
    }

    if (
      ir > 2.0 &&
      Math.random() < (ir - 2.0) * 2.0
    ) {
      addParticle();
    }

    if (
      this.count >
      this.maxParticles + 200
    ) {
      const ex = Math.min(
        15,
        this.count - this.maxParticles
      );

      for (let i = 0; i < ex; i++) {
        delete this.particles[this.count - i];
      }

      this.count -= ex;
    }
  }

  animate() {
    this.render();

    requestAnimationFrame(() =>
      this.animate()
    );
  }

  setScanningActive(active) {
    this.scanningActive = active;
  }
}

    const cardStream = new CardStreamController();

const particleSystem = new ParticleSystem();

const particleScanner = new ParticleScanner();

window.setScannerScanning = (active) =>
  particleScanner.setScanningActive(active);

const style = document.createElement("style");

    style.textContent = `
      @keyframes scanEffectV {
        0% {
          transform: translateY(-100%);
          opacity:0;
        }

        50% {
          opacity:1;
        }

        100% {
          transform:translateY(100%);
          opacity:0;
        }
      }

      canvas {
        display:block;
      }
    `;

    document.head.appendChild(style);

    return () => {
  window.setScannerScanning = null;

  if (cardStream.animationFrame) {
    cancelAnimationFrame(
      cardStream.animationFrame
    );
  }

  if (particleScanner.animationFrame) {
    cancelAnimationFrame(
      particleScanner.animationFrame
    );
  }
};
  }, []);

  return (
    <>
      <div className="top-toolbar">
        <div className="logo">
          ✦ SECUREBANK | ATM
        </div>
      </div>

      <div className="hero-text">
        <div className="hero-title">
          SECUREBANK
        </div>

        <div className="hero-subtitle">
          Por favor, inserte su tarjeta para comenzar
          a operar de forma segura.
        </div>
      </div>

      <div className="scanner-visual"></div>

      <div className="speed-indicator">
        <span ref={speedValueRef}></span>
      </div>

      <div className="container">
        <canvas
          id="particleCanvas"
          ref={particleCanvasRef}
        ></canvas>

        <canvas
          id="scannerCanvas"
          ref={scannerCanvasRef}
        ></canvas>

        <div
          className="card-stream"
          ref={cardStreamRef}
        >
          <div
            className="card-line"
            ref={cardLineRef}
          ></div>
        </div>
      </div>

      <button
        id="insertBtn"
        ref={insertBtnRef}
        onClick={() => navigate("/pin")}
      >
        <div>
          <div className="font-headline-md">
            Continuar
          </div>

          <div className="font-label-lg">
            Oprimir para ingresar a SECUREBANK.
          </div>
        </div>
      </button>

      <div className="secure-footer-nav">
        <div className="footer-left">
          <div className="footer-logo">
            ✦ SECUREBANK
          </div>

          <div className="footer-copy">
            © 2026 SecureBank International
          </div>
        </div>

        <div className="footer-links">
          <a href="#">Seguridad</a>
          <a href="#">Privacidad</a>
          <a href="#">Términos</a>
          <a href="#">Soporte</a>
        </div>

        <button
  className="footer-help-btn"
  onClick={() => setShowHelpModal(true)}
>
  <span>◎</span>
  ¿Necesita ayuda?
</button>
      </div>
      {showHelpModal && (
  <div
    className="help-modal-overlay"
    onClick={() => setShowHelpModal(false)}
  >
    <div
      className="help-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="help-modal-header">
        <h2>Centro de Ayuda</h2>

        <button
          className="close-modal-btn"
          onClick={() => setShowHelpModal(false)}
        >
          ✕
        </button>
      </div>

      <p className="help-modal-subtitle">
        Comuníquese con SecureBank utilizando
        cualquiera de los siguientes números:
      </p>

      <div className="help-phone-list">
        <div className="help-phone-item">
          <span>Atención al cliente</span>
          <strong>+502 2222-0101</strong>
        </div>

        <div className="help-phone-item">
          <span>Soporte ATM</span>
          <strong>+502 2222-0202</strong>
        </div>

        <div className="help-phone-item">
          <span>Emergencias</span>
          <strong>+502 2222-0303</strong>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default ATMWelcome;
