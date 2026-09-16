(() => {
  // Nav background intensifies on scroll
  const nav = document.getElementById("nav");
  const setNav = () => {
    if (!nav) return;
    const solid = window.scrollY > 8;
    nav.style.background = solid
      ? "rgba(33, 37, 37, 0.92)"
      : "rgba(33, 37, 37, 0.78)";
    nav.style.borderBottomColor = solid ? "#485346" : "#1f2a33";
  };
  setNav();
  window.addEventListener("scroll", setNav, { passive: true });

  // Cube pause-on-hover to let users inspect
  const cube = document.querySelector(".cube");
  const visual = document.querySelector(".hero__visual");
  if (cube && visual) {
    visual.addEventListener("mouseenter", () => {
      cube.style.animationPlayState = "paused";
    });
    visual.addEventListener("mouseleave", () => {
      cube.style.animationPlayState = "running";
    });
  }

  // Pause hero caption pulse when offscreen (perf)
  const caption = document.querySelector(".hero__caption .dot");
  if (caption && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          caption.style.animationPlayState = e.isIntersecting
            ? "running"
            : "paused";
        });
      },
      { threshold: 0 }
    );
    io.observe(caption);
  }

  // Smooth in-page anchor offset for fixed nav
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          const y =
            el.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    });
  });
})();
