// Color de texto legible sobre un fondo de color dado.
// Elige entre negro y phosphor-white el que mayor contraste dé (WCAG AA).

const NEGRO = "#000000";
const CLARO = "#ddffdc";

function luminancia(hex) {
  const n = parseInt(String(hex).replace("#", ""), 16);
  const lin = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contraste(a, b) {
  const l1 = luminancia(a);
  const l2 = luminancia(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function textoSobre(hex) {
  if (!hex) return NEGRO;
  return contraste(hex, NEGRO) >= contraste(hex, CLARO) ? NEGRO : CLARO;
}
