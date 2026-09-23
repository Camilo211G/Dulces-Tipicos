// Cliente HTTP delgado para /api

const BASE = "/api";

async function jsonFetch(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.ok ? "ok" : res.status} en ${path}`);
  return res.json();
}

export const api = {
  health: () => jsonFetch("/health"),
  categorias: () => jsonFetch("/categorias").then((d) => d.categorias),
  categoria: (slug) =>
    jsonFetch(`/categorias/${encodeURIComponent(slug)}`).then((d) => d.categoria),
};
