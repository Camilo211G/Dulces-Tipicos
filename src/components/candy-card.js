// Tarjeta 2D para dulces.
// Render: número de popularidad + <img> real + nombre + ingredientes.

export function renderCandyCard(dulce, { colorPrimary, colorSecondary, colorAccent, categorySlug }) {
  const article = document.createElement("article");
  article.className = "candy-card";
  article.setAttribute("data-popularidad", String(dulce.popularidad));
  if (dulce.esEmblematico) article.classList.add("candy-card--featured");

  const slug = dulce.imageSlug || slugify(dulce.nombre);
  const slugAttr = escapeAttr(slug);

  // Placeholder mientras resuelve la extensión real
  const placeholder = `<svg viewBox="0 0 100 100" width="88" height="88" aria-hidden="true">
    <circle cx="50" cy="50" r="38" fill="${colorPrimary}" opacity=".25"/>
  </svg>`;

  article.innerHTML = `
    <span class="candy-card__num">#${String(dulce.popularidad).padStart(2, "0")}</span>
    <div class="candy-card__icon" style="--accent:${colorAccent}" data-img-slot data-slug="${slugAttr}">${placeholder}</div>
    <h3 class="candy-card__title">${escapeHtml(dulce.nombre)}</h3>
    <p class="candy-card__desc">${escapeHtml(dulce.ingredientes)}</p>
  `;

  // Resolver la primera extensión existente (jpg → png → svg) y cargar el <img>
  const slot = article.querySelector("[data-img-slot]");
  resolveImageExtension(categorySlug, slug).then((ext) => {
    if (!ext) return;
    const img = document.createElement("img");
    img.className = "candy-card__img";
    img.src = `/assets/images/${categorySlug}/${slug}.${ext}`;
    img.alt = dulce.nombre;
    img.width = 88;
    img.height = 88;
    img.loading = "lazy";
    img.decoding = "async";
    slot.replaceChildren(img);
  });

  return article;
}

async function resolveImageExtension(categorySlug, slug) {
  const exts = ["jpg", "png", "svg"];
  for (const ext of exts) {
    const url = `/assets/images/${categorySlug}/${slug}.${ext}`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      const ct = res.headers.get("content-type") || "";
      if (res.ok && ct.startsWith("image/")) return ext;
    } catch {
      /* ignore */
    }
  }
  return null;
}

function slugify(str) {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
