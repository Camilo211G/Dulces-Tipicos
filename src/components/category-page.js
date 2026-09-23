// Monta la sección de categoría activa. Se desmonta al cambiar.

import { renderCandyCard } from "./candy-card.js";
import { renderCandy3D } from "./candy-3d.js";

export function mountCategory(categoria, { container, onEmblematicReady }) {
  container.innerHTML = "";

  const section = document.createElement("section");
  section.className = "category-page";
  section.setAttribute("data-cat", categoria.slug);
  section.style.setProperty("--cat-primary", categoria.colorPrimary);
  section.style.setProperty("--cat-secondary", categoria.colorSecondary);
  section.style.setProperty("--cat-accent", categoria.colorAccent);

  const emblematico = categoria.dulces.find((d) => d.esEmblematico);

  section.innerHTML = `
    <div class="category-page__inner">
      <header class="category-page__head">
        <span class="eyebrow eyebrow--dark" style="color:${categoria.colorPrimary}">${escapeHtml(categoria.eyebrow)}</span>
        <h2 class="category-page__title">
          <span style="color:${categoria.colorPrimary}">${escapeHtml(categoria.nombre.split(" ")[0])}</span>
          <span class="muted">${escapeHtml(categoria.nombre.split(" ").slice(1).join(" "))}</span>
        </h2>
        <p class="category-page__desc">${escapeHtml(categoria.descripcion)}</p>
      </header>

      <div class="category-page__feature" data-feature>
        ${emblematico
          ? `
            <div class="category-page__feature-3d" data-feature-3d></div>
            <div class="category-page__feature-info">
              <span class="category-page__feature-label">Dulce emblemático</span>
              <h3 class="category-page__feature-title">${escapeHtml(emblematico.nombre)}</h3>
              <p class="category-page__feature-desc">${escapeHtml(emblematico.ingredientes)}</p>
              <span class="category-page__feature-pop">Popularidad #${String(emblematico.popularidad).padStart(2, "0")}</span>
            </div>`
          : ""}
      </div>

      <div class="category-page__grid" data-grid></div>
    </div>
  `;

  container.appendChild(section);

  if (emblematico) {
    const feature3dHost = section.querySelector("[data-feature-3d]");
    const candy3d = renderCandy3D({
      geometry: emblematico.geometria3d,
      fill: categoria.colorPrimary,
      accent: categoria.colorSecondary,
      categorySlug: categoria.slug,
    });
    feature3dHost.appendChild(candy3d);
    onEmblematicReady?.(candy3d);
  }

  const grid = section.querySelector("[data-grid]");
  for (const dulce of categoria.dulces) {
    const card = renderCandyCard(dulce, {
      colorPrimary: categoria.colorPrimary,
      colorSecondary: categoria.colorSecondary,
      colorAccent: categoria.colorAccent,
      categorySlug: categoria.slug,
    });
    grid.appendChild(card);
  }

  return section;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
