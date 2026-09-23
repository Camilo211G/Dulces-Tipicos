// Router History API minimalista (sin librería)
// Rutas tipo "/tradicionales", "/picantes", etc.

const KNOWN_SLUGS = new Set([
  "tradicionales",
  "picantes",
  "dulces",
  "acidos",
  "gomas",
]);

const DEFAULT_SLUG = "tradicionales";

function parseSlug(pathname) {
  const cleaned = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!cleaned) return DEFAULT_SLUG;
  return KNOWN_SLUGS.has(cleaned) ? cleaned : DEFAULT_SLUG;
}

export function createRouter({ onChange }) {
  const handle = () => {
    const slug = parseSlug(window.location.pathname);
    onChange(slug, { push: false });
  };

  window.addEventListener("popstate", handle);

  return {
    start() {
      const slug = parseSlug(window.location.pathname);
      const cleanedPath = `/${slug}`;
      if (window.location.pathname !== cleanedPath) {
        window.history.replaceState({}, "", cleanedPath);
      }
      onChange(slug, { push: false });
    },
    navigate(slug) {
      if (!KNOWN_SLUGS.has(slug)) return;
      const target = `/${slug}`;
      if (window.location.pathname === target) return;
      window.history.pushState({}, "", target);
      onChange(slug, { push: true });
    },
    knownSlugs: () => Array.from(KNOWN_SLUGS),
  };
}
