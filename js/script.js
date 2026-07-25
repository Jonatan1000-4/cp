/*===========================================================
  PILAR CONSULTORA INTEGRAL — script.js
  JavaScript Vanilla — sin dependencias externas.
===========================================================*/
(function () {
  "use strict";

  /* ---------- 1. HEADER: cambia de estilo al hacer scroll ---------- */
  const header = document.getElementById("header");
  const onScrollHeader = () => {
    header.classList.toggle("active", window.scrollY > 60);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- 2. MENÚ RESPONSIVE ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  const closeMenu = () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- 3. SCROLL SUAVE PARA ANCLAS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ---------- 4. SCROLL REVEAL (aparición de secciones) ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- 5. CONTADORES ANIMADOS ---------- */
  const counters = document.querySelectorAll(".counter");
  const runCounter = (counter) => {
    const target = +counter.dataset.target;
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cúbico
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = target;
      }
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* ---------- 6. CARRUSEL DE TESTIMONIOS ---------- */
  const track = document.getElementById("testimonialTrack");
  const dotsWrap = document.getElementById("testimonialDots");

  if (track && dotsWrap) {
    const slides = Array.from(track.children);
    let current = 0;
    let autoplayTimer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `Ver testimonio ${i + 1}`);
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.children);

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    }

    function startAutoplay() {
      autoplayTimer = setInterval(() => goTo(current + 1), 6000);
    }
    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }

    startAutoplay();
    track.closest(".testimonial-slider").addEventListener("mouseenter", stopAutoplay);
    track.closest(".testimonial-slider").addEventListener("mouseleave", startAutoplay);
  }

  /* ---------- 7. BOTÓN VOLVER ARRIBA ---------- */
  const backTop = document.getElementById("backTop");
  window.addEventListener(
    "scroll",
    () => {
      backTop.classList.toggle("show", window.scrollY > 600);
    },
    { passive: true }
  );
  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 8. AÑO AUTOMÁTICO EN EL FOOTER ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 9. FORMULARIO DE CONTACTO ---------- */
  const form = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", () => {
      // FormSubmit.co gestiona el envío real; este mensaje es feedback inmediato al usuario.
      formNote.textContent = "Enviando tu consulta…";
    });
  }

  /* ---------- 10. LAZY LOADING DE IMÁGENES CON data-src (si se agregan fotos reales) ---------- */
  const lazyImgs = document.querySelectorAll("img[data-src]");
  if (lazyImgs.length) {
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          lazyObserver.unobserve(img);
        }
      });
    });
    lazyImgs.forEach((img) => lazyObserver.observe(img));
  }
})();
