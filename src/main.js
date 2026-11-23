// Dulce — bootstrap
// Orquesta: fetch categorías → hidrata nav → monta la activa →
// reemplaza el cubo del hero por el dulce emblemático 3D.

import { api } from "./lib/api.js";
import { createRouter } from "./lib/router.js";
import { renderNavLinks, setActiveNavLink, setupNavToggle } from "./components/nav.js";
import {
  renderFooterCategorias,
  setActiveFooterCategoria,
} from "./components/footer.js";
import { mountCategory } from "./components/category-page.js";
import { setupTextSize } from "./lib/text-size.js";
import { textoSobre } from "./lib/color.js";

const els = {
  categoryContainer: () => document.querySelector("[data-category-host]"),
  heroVisual: () => document.querySelector(".hero__visual"),
};

let cacheCategorias = [];
let primeraCarga = true;

const status = () => document.querySelector("[data-route-status]");

function applyCategoryToDocument(categoria) {
  document.documentElement.style.setProperty(
    "--cat-primary",
    categoria.colorPrimary
  );
  document.documentElement.style.setProperty(
    "--cat-secondary",
    categoria.colorSecondary
  );
  document.documentElement.style.setProperty(
    "--cat-accent",
    categoria.colorAccent
  );
  // Texto legible sobre el color de la categoría (botones, píldoras)
  document.documentElement.style.setProperty(
    "--cat-on",
    textoSobre(categoria.colorPrimary)
  );
  document.title = `${categoria.nombre} — Dulce`;
}

async function loadCategory(slug) {
  const categoria = await api.categoria(slug);
  const container = els.categoryContainer();
  if (!container) return;

  applyCategoryToDocument(categoria);
  setActiveNavLink(slug);
  setActiveFooterCategoria(slug);

  mountCategory(categoria, {
    container,
    onEmblematicReady: (candy3d) => {
      const visual = els.heroVisual();
      if (!visual) return;
      const existing = visual.querySelector(".candy3d, .cube");
      if (existing) existing.remove();
      visual.appendChild(candy3d);
    },
  });

  anunciarCategoria(categoria);

  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

/* Avisa a los lectores de pantalla del cambio de categoría y mueve el foco
   al título, para que la navegación con teclado no se pierda. */
function anunciarCategoria(categoria) {
  if (primeraCarga) {
    primeraCarga = false;
    return;
  }
  const live = status();
  if (live) live.textContent = `Categoría actual: ${categoria.nombre}`;
  const titulo = document.querySelector(".category-page__title");
  if (titulo) {
    titulo.setAttribute("tabindex", "-1");
    titulo.focus({ preventScroll: true });
  }
}

async function bootstrap() {
  try {
    cacheCategorias = await api.categorias();

    renderNavLinks(cacheCategorias, {
      activeSlug: null,
      onSelect: (slug) => router.navigate(slug),
    });

    renderFooterCategorias(cacheCategorias, {
      activeSlug: null,
      onSelect: (slug) => router.navigate(slug),
    });

    const router = createRouter({
      onChange: (slug) => {
        loadCategory(slug).catch((err) => console.error("[load]", err));
      },
    });

    setupNavToggle();
    setupTextSize(document.querySelector("[data-text-size]"));

    const anio = document.querySelector("[data-year]");
    if (anio) anio.textContent = String(new Date().getFullYear());

    window.__router = router;
    router.start();
  } catch (err) {
    console.error("[bootstrap]", err);
    const container = els.categoryContainer();
    if (container) {
      container.innerHTML = `<p style="color:#d62828;padding:40px;text-align:center;">No se pudo conectar con la API. ¿Está corriendo el servidor en :3001?</p>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", bootstrap);
