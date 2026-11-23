// Utilidades compartidas de las páginas legales

import { setupTextSize } from "./text-size.js";

export function setupLegalPage() {
  setupTextSize(document.querySelector("[data-text-size]"));

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
}
