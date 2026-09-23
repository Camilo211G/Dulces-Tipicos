// Dulce 3D CSS — 5 geometrías representativas, una por categoría.
// Cada builder devuelve un árbol de divs posicionados con
// translate3d + rotateX/Y/Z dentro de un contenedor preserve-3d,
// mismo patrón que el cubo original del hero.
//
// Geometrías soportadas:
//   mazapan-disc    → Tradicionales y Artesanales (disco de mazapán)
//   flame-cone      → Picantes y Enchilados     (rombos apilados)
//   scoop-cluster   → Dulces y Chocolatosos     (bochas de helado)
//   gem-bipyramid   → Ácidos y Salados          (cristal facetado)
//   gummy-ring      → Gomas de Mascar y Gomitas (aro de cuentas)

/* ============================================================
 * Utilidades de color
 * ============================================================ */
function shadeColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

function mixColor(hexA, hexB, t) {
  const a = parseInt(hexA.replace("#", ""), 16);
  const b = parseInt(hexB.replace("#", ""), 16);
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

/* ============================================================
 * Esfera real (compartida por Dulces y Gomas)
 * Técnica de meridianos: N discos del mismo diámetro rotados
 * 0°..180° alrededor de Y. Cada disco es un círculo completo, así
 * que al superponerse rellenan el volumen y se leen como una bocha
 * sólida sin importar el ángulo de cámara.
 * ============================================================ */
function buildSphereFaces({ size, fill, accent, meridians = 10 }) {
  const angleStep = 180 / meridians;
  const rings = Array.from({ length: meridians }, (_, i) => {
    const angle = (angleStep * i).toFixed(2);
    return `<div class="candy3d__face candy3d__face--meridian" style="width:${size}px;height:${size}px;border-radius:50%;transform:rotateY(${angle}deg);background:radial-gradient(circle at 32% 28%, #ffffffcc, ${fill} 55%, ${accent} 100%);opacity:0.82;"></div>`;
  }).join("");
  const core = `<div class="candy3d__face candy3d__face--core" style="width:${(size * 0.94).toFixed(1)}px;height:${(size * 0.94).toFixed(1)}px;border-radius:50%;background:radial-gradient(circle at 32% 28%, #ffffffdd, ${fill} 60%, ${accent} 100%);"></div>`;
  return rings + core;
}

function buildSphere({ size = 60, fill = "#ffffff", accent = "#cccccc", meridians = 10 }) {
  const inner = buildSphereFaces({ size, fill, accent, meridians });
  return `<div class="candy3d__cube candy3d__cube--sphere" style="width:${size}px;height:${size}px;">${inner}</div>`;
}

/* ============================================================
 * 1) TRADICIONALES Y ARTESANALES — "mazapan-disc"
 * Paleta: Identidad Patria (beige de cacahuate + acento terracota).
 * Referencia visual: mazapán De la Rosa — disco compacto marcado
 * en gajos radiales. Disco con bisel en el canto y motas de textura
 * para que no se vea liso.
 * ============================================================ */
function buildPrismFaces({ size, depth, sides = 10, fill, accent, capless = false }) {
  const radius = size / 2;
  const angleStep = 360 / sides;
  const staveWidth = ((2 * Math.PI * radius) / sides) * 1.02;

  const staves = Array.from({ length: sides }, (_, i) => {
    const angle = angleStep * i;
    const rad = (angle * Math.PI) / 180;
    const tx = (Math.sin(rad) * radius).toFixed(2);
    const tz = (Math.cos(rad) * radius).toFixed(2);
    const facingLight = 0.5 + 0.5 * Math.cos(rad);
    const bevel = shadeColor(fill, Math.round(facingLight * 26 - 8));
    const transform = `translate3d(${tx}px, 0px, ${tz}px) rotateY(${angle}deg)`;
    return `<div class="candy3d__face candy3d__face--stave" style="width:${staveWidth.toFixed(2)}px;height:${depth}px;transform:${transform};background:${bevel};box-shadow:inset 0 0 0 2px ${accent}22;"></div>`;
  }).join("");

  if (capless) return staves;

  const capTop = `<div class="candy3d__face candy3d__face--cap" style="width:${size}px;height:${size}px;border-radius:50%;transform:translate3d(0px, ${-depth / 2}px, 0px) rotateX(90deg);background:${accent};"></div>`;
  const capBottom = `<div class="candy3d__face candy3d__face--cap" style="width:${size}px;height:${size}px;border-radius:50%;transform:translate3d(0px, ${depth / 2}px, 0px) rotateX(-90deg);background:${fill};"></div>`;

  return staves + capTop + capBottom;
}

function buildMazapanFaces({ size, depth, fill = "#e8c39e", accent = "#b5804a", wedges = 8 }) {
  const rim = buildPrismFaces({ size, depth, sides: 22, fill, accent, capless: true });

  const wedgeAngle = (360 / wedges).toFixed(2);
  const scoreLines = `repeating-conic-gradient(${fill} 0deg calc(${wedgeAngle}deg - 1.4deg), ${accent} calc(${wedgeAngle}deg - 1.4deg) ${wedgeAngle}deg)`;
  const crumbs = [
    "radial-gradient(circle at 22% 24%, #ffffff55 0 3%, transparent 4%)",
    "radial-gradient(circle at 68% 18%, #00000022 0 2.5%, transparent 3.5%)",
    "radial-gradient(circle at 40% 70%, #ffffff44 0 2%, transparent 3%)",
    "radial-gradient(circle at 78% 62%, #00000022 0 2%, transparent 3%)",
    "radial-gradient(circle at 35% 30%, #ffffff40, transparent 62%)",
  ].join(", ");

  const top = `<div class="candy3d__face candy3d__face--cap candy3d__face--mazapan-top" style="width:${size}px;height:${size}px;border-radius:50%;transform:translate3d(0px, ${-depth / 2}px, 0px) rotateX(90deg);background:${crumbs}, ${scoreLines};"></div>`;
  const bottom = `<div class="candy3d__face candy3d__face--cap" style="width:${size}px;height:${size}px;border-radius:50%;transform:translate3d(0px, ${depth / 2}px, 0px) rotateX(-90deg);background:${shadeColor(fill, -10)};"></div>`;

  return rim + top + bottom;
}

function buildMazapanDisc({ size = 130, depth = 26, fill = "#e8c39e", accent = "#b5804a", wedges = 8 }) {
  const inner = buildMazapanFaces({ size, depth, fill, accent, wedges });
  return `<div class="candy3d__cube candy3d__cube--mazapan" style="width:${size}px;height:${size}px;">${inner}</div>`;
}

/* ============================================================
 * 2) PICANTES Y ENCHILADOS — "flame-cone" (versión original)
 * Paleta: Fuego Azteca (rojo/naranja/amarillo).
 * Tiers apilados de rombos (rotateZ 45deg) que se van achicando y
 * rotando levemente hacia arriba, imitando las lenguas de una flama
 * estilizada.
 * ============================================================ */
function buildFlameFaces({ size, depth, fill, accent, tiers = 5 }) {
  return Array.from({ length: tiers }, (_, i) => {
    const scale = 1 - i * 0.18;
    const ty = -i * (depth * 0.22);
    const rot = i * 18 - (tiers * 9);
    const tone = i % 2 === 0 ? fill : accent;
    return `<div class="candy3d__face candy3d__face--flame-tier" style="width:${(size * scale).toFixed(1)}px;height:${(size * scale).toFixed(1)}px;transform:translate3d(0px, ${ty.toFixed(1)}px, 0px) rotateY(${rot}deg) rotateZ(45deg);background:${tone};"></div>`;
  }).join("");
}

function buildFlameCone({ size = 120, depth = 120, fill = "#ff4500", accent = "#ffb703", tiers = 5 }) {
  const inner = buildFlameFaces({ size, depth, fill, accent, tiers });
  return `<div class="candy3d__cube candy3d__cube--flame" style="width:${size}px;height:${size}px;">${inner}</div>`;
}

/* ============================================================
 * 3) DULCES Y CHOCOLATOSOS — "scoop-cluster"
 * Paleta: Nostalgia Pastel (celeste, rosa, crema).
 * Bochas de helado reales (esferas con meridianos) posicionadas en
 * una pirámide 3D.
 * ============================================================ */
function buildScoopCluster({ size = 120, fill = "#7ec8e3", accent = "#f7b8d0" }) {
  const r = size * 0.32;
  const scoops = [
    { tx: 0, ty: 0, tz: 0, scale: 0.62, tone: "fill" },
    { tx: -r, ty: -r * 0.42, tz: r * 0.42, scale: 0.5, tone: "accent" },
    { tx: r, ty: -r * 0.62, tz: -r * 0.2, scale: 0.46, tone: "fill" },
    { tx: 0, ty: -r * 1.35, tz: 0, scale: 0.4, tone: "accent" },
  ];

  const inner = scoops
    .map(({ tx, ty, tz, scale, tone }) => {
      const d = size * scale;
      const sFill = tone === "accent" ? accent : fill;
      const sAccent = tone === "accent" ? fill : accent;
      const sphere = buildSphereFaces({ size: d, fill: sFill, accent: sAccent, meridians: 9 });
      return `<div class="candy3d__cube candy3d__cube--scoop" style="width:${d.toFixed(1)}px;height:${d.toFixed(1)}px;transform:translate(-50%,-50%) translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px);">${sphere}</div>`;
    })
    .join("");

  return `<div class="candy3d__cube candy3d__cube--scoops" style="width:${size}px;height:${size}px;">${inner}</div>`;
}

/* ============================================================
 * 4) ÁCIDOS Y SALADOS — "gem-bipyramid"
 * Paleta: Contraste Eléctrico (morado #9d00ff / amarillo #fff200).
 * Bipirámide de facetas triangulares con brillo variable por faceta
 * para que se lea como destello de cristal.
 * ============================================================ */
function buildBipyramidFaces({ size, depth, sides = 6, fill, accent }) {
  const radius = size / 2;
  const angleStep = 360 / sides;
  const apexY = depth / 2;

  return Array.from({ length: sides }, (_, i) => {
    const angle = angleStep * i;
    const rad = (angle * Math.PI) / 180;
    const tx = (Math.sin(rad) * radius * 0.5).toFixed(2);
    const tz = (Math.cos(rad) * radius * 0.5).toFixed(2);

    const sparkle = i % 3 === 0 ? 24 : i % 3 === 1 ? -6 : 8;
    const toneTop = shadeColor(i % 2 ? fill : accent, sparkle);
    const toneBottom = shadeColor(i % 2 ? accent : fill, -sparkle);

    const top = `<div class="candy3d__face candy3d__face--facet" style="width:${radius}px;height:${apexY}px;transform:translate3d(${tx}px, ${(-apexY / 2).toFixed(1)}px, ${tz}px) rotateY(${angle}deg) rotateX(35deg);background:${toneTop};clip-path:polygon(50% 0%, 0% 100%, 100% 100%);box-shadow:inset 0 0 8px #ffffff33;"></div>`;
    const bottom = `<div class="candy3d__face candy3d__face--facet" style="width:${radius}px;height:${apexY}px;transform:translate3d(${tx}px, ${(apexY / 2).toFixed(1)}px, ${tz}px) rotateY(${angle}deg) rotateX(-35deg);background:${toneBottom};clip-path:polygon(50% 100%, 0% 0%, 100% 0%);box-shadow:inset 0 0 8px #00000022;"></div>`;
    return top + bottom;
  }).join("");
}

function buildGemBipyramid({ size = 120, depth = 120, sides = 6, fill = "#9d00ff", accent = "#fff200" }) {
  const inner = buildBipyramidFaces({ size, depth, sides, fill, accent });
  return `<div class="candy3d__cube candy3d__cube--gem" style="width:${size}px;height:${size}px;">${inner}</div>`;
}

/* ============================================================
 * 5) GOMAS DE MASCAR Y GOMITAS — "gummy-ring"
 * Paleta: Cultura Pop y Neón (rosa neón / verde neón).
 * Cuentas esféricas reales dispuestas en un círculo verdadero en el
 * plano X-Z, dentro de un contenedor inclinado con rotateX — así el
 * aro se ve correcto sin importar el punto de la animación.
 * ============================================================ */
function buildRingSegmentFaces({ size, fill, accent, segments = 14 }) {
  const radius = size / 2;
  const tube = size * 0.22;
  const angleStep = 360 / segments;

  return Array.from({ length: segments }, (_, i) => {
    const angle = angleStep * i;
    const rad = (angle * Math.PI) / 180;
    const tx = (Math.sin(rad) * radius).toFixed(2);
    const ty = (Math.cos(rad) * radius * 0.35).toFixed(2);
    const tone = i % 3 === 0 ? accent : fill;
    return `<div class="candy3d__face candy3d__face--gummy" style="width:${tube.toFixed(1)}px;height:${tube.toFixed(1)}px;border-radius:50%;transform:translate3d(${tx}px, ${ty}px, 0px) rotateZ(${angle}deg);background:${tone};box-shadow:inset 0 0 0 2px #ffffff33;"></div>`;
  }).join("");
}

function buildGummyRing({ size = 120, tilt = 62, fill = "#ff2d95", accent = "#7cfc00", segments = 14 }) {
  const radius = size / 2;
  const tube = size * 0.2;
  const angleStep = 360 / segments;

  const beads = Array.from({ length: segments }, (_, i) => {
    const angle = angleStep * i;
    const rad = (angle * Math.PI) / 180;
    const tx = (Math.sin(rad) * radius).toFixed(2);
    const tz = (Math.cos(rad) * radius).toFixed(2);
    const tone = i % 3 === 0 ? accent : fill;
    const bead = buildSphereFaces({ size: tube, fill: tone, accent: shadeColor(tone, -20), meridians: 6 });
    return `<div class="candy3d__cube candy3d__cube--gummy-bead" style="width:${tube.toFixed(1)}px;height:${tube.toFixed(1)}px;transform:translate(-50%,-50%) translate3d(${tx}px, 0px, ${tz}px);">${bead}</div>`;
  }).join("");

  return `<div class="candy3d__cube candy3d__cube--ring-tilt" style="width:${size}px;height:${size}px;transform:rotateX(${tilt}deg);">${beads}</div>`;
}

function buildGummyRingCluster({ size = 120, fill = "#ff2d95", accent = "#7cfc00" }) {
  const ringA = buildGummyRing({ size, tilt: 62, fill, accent });
  const ringB = buildGummyRing({ size: size * 0.82, tilt: 62, fill: accent, accent: fill });
  return `
    <div class="candy3d__cube candy3d__cube--ring-a" style="width:${size}px;height:${size}px;">${ringA}</div>
    <div class="candy3d__cube candy3d__cube--ring-b" style="width:${size}px;height:${size}px;transform:translate(-50%,-50%) translate3d(${(size * 0.22).toFixed(1)}px, ${(size * 0.14).toFixed(1)}px, ${(size * 0.18).toFixed(1)}px) rotateZ(28deg);">${ringB}</div>
  `;
}

/* ============================================================
 * Registro y dispatcher
 * ============================================================ */
const GEOMETRY_DEFAULTS = {
  "mazapan-disc": { size: 130, depth: 26, wedges: 8 },
  "flame-cone": { size: 120, depth: 120, tiers: 5 },
  "scoop-cluster": { size: 120 },
  "gem-bipyramid": { size: 120, depth: 120, sides: 6 },
  "gummy-ring": { size: 120, segments: 14 },
};

const BUILDERS = {
  "mazapan-disc": buildMazapanDisc,
  "flame-cone": buildFlameCone,
  "scoop-cluster": buildScoopCluster,
  "gem-bipyramid": buildGemBipyramid,
  "gummy-ring": buildGummyRingCluster,
};

export function renderCandy3D({ geometry, fill, accent, size = 160, categorySlug } = {}) {
  const defaults = GEOMETRY_DEFAULTS[geometry];
  if (!defaults) {
    console.warn(`[candy-3d] geometría desconocida: ${geometry}`);
    return document.createElement("div");
  }
  const cfg = { ...defaults, size, fill, accent };
  const builder = BUILDERS[geometry];
  const inner = builder(cfg);

  const wrap = document.createElement("div");
  wrap.className = "candy3d";
  wrap.setAttribute("data-geometry", geometry);
  wrap.style.setProperty("--candy3d-size", `${cfg.size}px`);
  wrap.style.setProperty("--candy3d-depth", `${cfg.depth ?? cfg.size}px`);

  const stageClass = categorySlug
    ? `candy3d__stage candy3d__stage--${categorySlug}`
    : "candy3d__stage";
  wrap.innerHTML = `<div class="${stageClass}">${inner}</div>`;
  return wrap;
}
