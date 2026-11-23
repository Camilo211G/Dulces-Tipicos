// Monta la sección de categoría activa. Se desmonta al cambiar.

import { renderCandyCard } from "./candy-card.js";
import { renderCandy3D } from "./candy-3d.js";
import { getCategoryVideo } from "../lib/videos.js";

export function mountCategory(categoria, { container, onEmblematicReady }) {
  // Si se cambia de categoría, el video anterior se queda sin pantalla.
  container.querySelectorAll("video").forEach((v) => v.pause());
  container.innerHTML = "";

  const section = document.createElement("section");
  section.className = "category-page";
  section.setAttribute("data-cat", categoria.slug);
  section.style.setProperty("--cat-primary", categoria.colorPrimary);
  section.style.setProperty("--cat-secondary", categoria.colorSecondary);
  section.style.setProperty("--cat-accent", categoria.colorAccent);

  const emblematico = categoria.dulces.find((d) => d.esEmblematico);
  const video = getCategoryVideo(categoria.slug);

  section.innerHTML = `
    <div class="category-page__inner">
      <header class="category-page__head">
        <span class="eyebrow eyebrow--dark">${escapeHtml(categoria.eyebrow)}</span>
        <h2 class="category-page__title">
          <span style="color:${categoria.colorPrimary}">${escapeHtml(categoria.nombre.split(" ")[0])}</span>
          <span class="muted">${escapeHtml(categoria.nombre.split(" ").slice(1).join(" "))}</span>
        </h2>
        <p class="category-page__desc">${escapeHtml(categoria.descripcion)}</p>
      </header>

      <div class="category-page__feature" data-feature>
        ${
          video
            ? `
            <div class="category-page__feature-3d" data-feature-3d>
              <button class="category-page__video-thumb" type="button" data-video-toggle
                      aria-expanded="false" aria-controls="feature-video"
                      aria-label="Reproducir el video de ${escapeAttr(video.label)} (${escapeHtml(video.duracion)})">
                <img class="category-page__video-poster" src="${escapeAttr(video.poster)}"
                     alt="" loading="lazy" decoding="async"
                     width="1280" height="720" />
                <span class="category-page__video-play" aria-hidden="true">
                  <svg class="category-page__video-icon-play" viewBox="0 0 24 24" width="26" height="26" focusable="false">
                    <path d="M8 5.2v13.6L19 12z" fill="currentColor" />
                  </svg>
                  <svg class="category-page__video-icon-close" viewBox="0 0 24 24" width="22" height="22" focusable="false">
                    <path d="M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6z" fill="currentColor" />
                  </svg>
                </span>
                <span class="category-page__video-badge">
                  <span class="category-page__video-badge-text" data-video-badge-text>Ver video</span>
                  <span class="category-page__video-badge-dur">${escapeHtml(video.duracion)}</span>
                </span>
              </button>
            </div>`
            : ""
        }
        ${
          emblematico
            ? `
            <div class="category-page__feature-info">
              <span class="category-page__feature-label">Dulce emblemático</span>
              <h3 class="category-page__feature-title">${escapeHtml(emblematico.nombre)}</h3>
              <p class="category-page__feature-desc">${escapeHtml(emblematico.ingredientes)}</p>
              <span class="category-page__feature-pop">Catálogo #${String(emblematico.popularidad).padStart(2, "0")}</span>
              <span class="category-page__feature-note">Orden editorial del catálogo, no es una métrica de ventas</span>
            </div>`
            : ""
        }
        ${
          video
            ? `
            <div class="category-page__feature-video" id="feature-video" data-video-panel>
              <div class="category-page__feature-video-inner">
                <video class="category-page__video" data-video controls playsinline preload="metadata"
                       poster="${escapeAttr(video.poster)}"
                       aria-label="Video de ${escapeAttr(video.label)}"
                       aria-describedby="feature-video-desc">
                  <source src="${escapeAttr(video.src)}" type="video/mp4" />
                  <track kind="captions" src="${escapeAttr(video.vtt)}" srclang="es"
                         label="Descripción del video" default />
                  Tu navegador no soporta la reproducción de video.
                </video>
                <p class="category-page__video-desc" id="feature-video-desc">
                  <strong>Descripción del video:</strong> ${escapeHtml(video.descripcion)}
                  <strong>Video generado con inteligencia artificial</strong>, sin personas
                  identificables ni voz en off.
                </p>
              </div>
            </div>`
            : ""
        }
      </div>

      <div class="category-page__grid" data-grid></div>
    </div>
  `;

  container.appendChild(section);

  if (emblematico) {
    // El dulce 3D vive en el hero; feature-3d aloja la miniatura del video.
    const candy3d = renderCandy3D({
      geometry: emblematico.geometria3d,
      fill: categoria.colorPrimary,
      accent: categoria.colorSecondary,
      categorySlug: categoria.slug,
    });
    onEmblematicReady?.(candy3d);
  }

  if (video) setupVideo(section);

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

/* Click en la miniatura → el feature se estira hacia abajo y arranca el video.
   Segundo click → colapsa, pausa y rebobina. Sin modales. */
function setupVideo(section) {
  const feature = section.querySelector("[data-feature]");
  const toggle = section.querySelector("[data-video-toggle]");
  const media = section.querySelector("[data-video]");
  const badgeText = section.querySelector("[data-video-badge-text]");
  if (!feature || !toggle || !media) return;

  const etiqueta = toggle.getAttribute("aria-label") || "";
  const setOpen = (open) => {
    feature.classList.toggle("is-video-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (badgeText) badgeText.textContent = open ? "Cerrar video" : "Ver video";
    toggle.setAttribute(
      "aria-label",
      open ? etiqueta.replace("Reproducir", "Cerrar") : etiqueta.replace("Cerrar", "Reproducir")
    );
  };

  toggle.addEventListener("click", () => {
    const open = !feature.classList.contains("is-video-open");
    setOpen(open);
    if (open) {
      media.play().catch(() => {
        /* autoplay bloqueado: el panel queda abierto con los controles nativos */
      });
    } else {
      media.pause();
      media.currentTime = 0;
    }
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, "&#39;");
}
