// Botón "Texto grande": escala la tipografía al 125%.
// La preferencia NO se guarda (el sitio no usa cookies ni localStorage).

export function setupTextSize(button) {
  if (!button) return;
  const root = document.documentElement;
  const text = button.querySelector("[data-text-size-label]");

  const apply = (on) => {
    root.classList.toggle("is-large-text", on);
    button.setAttribute("aria-pressed", String(on));
    if (text) text.textContent = on ? "Texto normal" : "Texto grande";
  };

  apply(root.classList.contains("is-large-text"));

  button.addEventListener("click", () => {
    apply(!root.classList.contains("is-large-text"));
  });
}
