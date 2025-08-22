document.addEventListener("DOMContentLoaded", () => {
  // Year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Per-letter name hover
  const nameEl = document.getElementById("name-hover-effect");
  const nameText = nameEl.textContent;
  nameEl.innerHTML = "";
  nameText.split("").forEach((ch) => {
    const span = document.createElement("span");
    span.textContent = ch === " " ? "\u00A0" : ch;
    nameEl.appendChild(span);
  });

  // Cursor glow
  const cursorGlow = document.querySelector(".cursor-glow");
  document.addEventListener("mousemove", (e) => {
    cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  // Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });
  function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // Global smooth scroll helper
  window.scrollToSection = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    lenis.scrollTo(el, { offset: -80, duration: 1.2 });
  };

  // GSAP animations
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);
    const heroTimeline = gsap.timeline({ delay: 0.2 });
    heroTimeline
      .from("#name-hover-effect span", { y: -28, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.05 })
      .from(".tagline", { y: 12, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=1")
      .from(".quote", { y: 8, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=0.8")
      .from(".glow-rotate", { scale: 0.9, opacity: 0, duration: 0.9, ease: "back.out(1.7)" }, "-=0.7")
      .from(".cta-row .btn", { y: 10, opacity: 0, stagger: 0.1, duration: 0.7, ease: "power2.out" }, "-=0.7")
      .from(".hero-card", { x: 40, opacity: 0, duration: 1, ease: "power3.out" }, "-=1");

    gsap.utils.toArray("main section.panel").forEach((panel) => {
      gsap.from(panel, {
        scrollTrigger: { trigger: panel, start: "top 85%", toggleActions: "play none none reverse" },
        y: 40, opacity: 0, duration: 1, ease: "power3.out",
      });
    });

    gsap.utils.toArray(".projects-grid .project, .gallery-grid .place").forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 90%" },
        y: 20, opacity: 0, duration: 0.7, delay: i * 0.08, ease: "power3.out",
      });
    });
  }

  // Back to top
  const backToTop = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 300);
  });
  backToTop.addEventListener("click", () => {
    lenis.scrollTo(0, { duration: 1.5 });
  });

  // Modal (projects picker)
  const modal = document.getElementById("projects-modal");
  const openBtn = document.getElementById("open-projects-picker");
  openBtn.addEventListener("click", () => {
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open",""); // fallback
  });
  modal.addEventListener("click", (e) => {
    // close when clicking backdrop area
    const rect = modal.querySelector(".modal-card").getBoundingClientRect();
    const inDialog = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inDialog) modal.close();
  });

  // Reduced motion
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mq.matches && window.gsap) gsap.globalTimeline.timeScale(0);
});
