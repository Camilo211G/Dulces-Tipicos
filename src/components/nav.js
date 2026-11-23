// Hidrata el <nav class="nav__links"> con un <a> por categoría

export function renderNavLinks(categorias, { activeSlug, onSelect }) {
  const nav = document.querySelector(".nav__links");
  if (!nav) return;
  nav.innerHTML = "";

  for (const cat of categorias) {
    const a = document.createElement("a");
    a.href = `/${cat.slug}`;
    a.textContent = cat.nombre.split(" ")[0];
    a.setAttribute("data-cat", cat.slug);
    a.setAttribute("aria-label", cat.nombre);
    if (cat.slug === activeSlug) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    }
    a.addEventListener("click", (e) => {
      e.preventDefault();
      onSelect(cat.slug);
    });
    nav.appendChild(a);
  }
}

export function setActiveNavLink(slug) {
  const links = document.querySelectorAll(".nav__links a");
  for (const link of links) {
    const isActive = link.getAttribute("data-cat") === slug;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
}

/* Menú desplegable en pantallas pequeñas.
   El botón alterna aria-expanded; Escape o un clic fuera lo cierran. */
export function setupNavToggle() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("#nav-menu");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Cerrar el menú de categorías" : "Abrir el menú de categorías"
    );
  };

  toggle.addEventListener("click", () => {
    setOpen(!menu.classList.contains("is-open"));
  });

  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!menu.classList.contains("is-open")) return;
    setOpen(false);
    toggle.focus();
  });

  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("is-open")) return;
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    setOpen(false);
  });

  // Al volver a pantallas grandes el panel se cierra solo
  const wide = window.matchMedia("(min-width: 861px)");
  wide.addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
}
