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
  links.forEach((link) => {
    const isActive = link.getAttribute("data-cat") === slug;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}
