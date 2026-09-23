// Footer: hidrata la columna "Categorías" desde /api/categorias

export function renderFooterCategorias(categorias, { activeSlug, onSelect }) {
  const ul = document.querySelector("[data-footer-categorias]");
  if (!ul) return;
  ul.innerHTML = "";

  for (const cat of categorias) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `/${cat.slug}`;
    a.textContent = cat.nombre;
    a.setAttribute("data-cat", cat.slug);
    if (cat.slug === activeSlug) a.setAttribute("aria-current", "page");
    a.addEventListener("click", (e) => {
      e.preventDefault();
      onSelect(cat.slug);
    });
    li.appendChild(a);
    ul.appendChild(li);
  }
}

export function setActiveFooterCategoria(slug) {
  const links = document.querySelectorAll("[data-footer-categorias] a");
  links.forEach((link) => {
    const isActive = link.getAttribute("data-cat") === slug;
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}
