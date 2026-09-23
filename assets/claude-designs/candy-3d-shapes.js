/**
 * candy-3d-shapes.js
 * -------------------------------------------------------------------------
 * Extensión de src/components/candy-3d.js con 5 geometrías representativas,
 * una por categoría, usando el MISMO patrón que buildCubeFaces/buildCubePowder:
 * cada geometría es un array de "caras" (o piezas) posicionadas con
 * translate3d + rotateX/rotateY/rotateZ dentro de un contenedor
 * transform-style: preserve-3d.
 *
 * Pega este contenido dentro de src/components/candy-3d.js (o impórtalo
 * como módulo aparte) y registra las entradas en GEOMETRY_DEFAULTS / el
 * dispatcher que usa renderCandy3D (línea ~113 en tu archivo original).
 * -------------------------------------------------------------------------
 */

/* ============================================================
 * 1) TRADICIONALES Y ARTESANALES — "mazapan-disc"
 *    Paleta: Identidad Patria (beige de cacahuate + acento terracota)
 *    Referencia visual: mazapán De la Rosa — disco compacto marcado
 *    en gajos radiales que se desmorona al partirlo.
 *    Técnica: reutiliza buildPrismFaces (aro/canto del disco) + dos
 *    tapas circulares; la tapa de arriba usa un repeating-conic-
 *    gradient para dibujar las líneas de "gajo" marcadas del mazapán,
 *    sin agregar caras nuevas al mecanismo base.
 * ============================================================ */
function buildPrismFaces({ size, depth, sides = 10, fill, accent, capless = false }) {
  const radius = size / 2;
  const angleStep = 360 / sides;
  // ancho de cada duela para que, unidas, cierren el círculo
  const staveWidth = ((2 * Math.PI * radius) / sides) * 1.02;

  const staves = Array.from({ length: sides }, (_, i) => {
    const angle = angleStep * i;
    const rad = (angle * Math.PI) / 180;
    const tx = (Math.sin(rad) * radius).toFixed(2);
    const tz = (Math.cos(rad) * radius).toFixed(2);
    const transform = `translate3d(${tx}px, 0px, ${tz}px) rotateY(${angle}deg)`;
    return `<div class="candy3d__face candy3d__face--stave" style="width:${staveWidth.toFixed(2)}px;height:${depth}px;transform:${transform};background:${fill};box-shadow:inset 0 0 0 2px ${accent}22;"></div>`;
  }).join("");

  if (capless) return staves;

  const capTop = `<div class="candy3d__face candy3d__face--cap" style="width:${size}px;height:${size}px;border-radius:50%;transform:translate3d(0px, ${-depth / 2}px, 0px) rotateX(90deg);background:${accent};"></div>`;
  const capBottom = `<div class="candy3d__face candy3d__face--cap" style="width:${size}px;height:${size}px;border-radius:50%;transform:translate3d(0px, ${depth / 2}px, 0px) rotateX(-90deg);background:${fill};"></div>`;

  return staves + capTop + capBottom;
}

function buildMazapanFaces({ size, depth, fill = "#e8c39e", accent = "#b5804a", wedges = 8 }) {
  // canto del disco: mismo aro de duelas que el prisma genérico, sin tapas propias
  const rim = buildPrismFaces({ size, depth, sides: 22, fill, accent, capless: true });

  // tapa superior: líneas radiales finas cada (360 / wedges) grados,
  // que es justo el patrón de "gajos" marcados del mazapán real
  const wedgeAngle = (360 / wedges).toFixed(2);
  const scoreLines = `repeating-conic-gradient(${fill} 0deg calc(${wedgeAngle}deg - 1.4deg), ${accent} calc(${wedgeAngle}deg - 1.4deg) ${wedgeAngle}deg)`;
  const crumbTexture = `radial-gradient(circle at 35% 30%, #ffffff40, transparent 62%)`;

  const top = `<div class="candy3d__face candy3d__face--cap candy3d__face--mazapan-top" style="width:${size}px;height:${size}px;border-radius:50%;transform:translate3d(0px, ${-depth / 2}px, 0px) rotateX(90deg);background:${crumbTexture}, ${scoreLines};"></div>`;
  const bottom = `<div class="candy3d__face candy3d__face--cap" style="width:${size}px;height:${size}px;border-radius:50%;transform:translate3d(0px, ${depth / 2}px, 0px) rotateX(-90deg);background:${fill};"></div>`;

  return rim + top + bottom;
}

function buildMazapanDisc({ size = 130, depth = 26, fill = "#e8c39e", accent = "#b5804a", wedges = 8 }) {
  const inner = buildMazapanFaces({ size, depth, fill, accent, wedges });
  return `<div class="candy3d__cube candy3d__cube--mazapan" style="width:${size}px;height:${size}px;">${inner}</div>`;
}

/* ============================================================
 * 2) PICANTES Y ENCHILADOS — "flame-cone"
 *    Paleta: Fuego Azteca (rojo/naranja/amarillo)
 *    Técnica: tiers apilados de rombos (rotateZ 45deg) que se
 *    van achicando y rotando levemente hacia arriba, imitando
 *    las lenguas de una flama estilizada tipo icono.
 * ============================================================ */
function buildFlameFaces({ size, depth, fill, accent, tiers = 5 }) {
  return Array.from({ length: tiers }, (_, i) => {
    const scale = 1 - i * 0.18;
    const ty = -i * (depth * 0.22);
    const rot = i * 18 - (tiers * 9); // leve serpenteo alrededor del eje Y
    const tone = i % 2 === 0 ? fill : accent;
    return `<div class="candy3d__face candy3d__face--flame-tier" style="width:${(size * scale).toFixed(1)}px;height:${(size * scale).toFixed(1)}px;transform:translate3d(0px, ${ty.toFixed(1)}px, 0px) rotateY(${rot}deg) rotateZ(45deg);background:${tone};"></div>`;
  }).join("");
}

function buildFlameCone({ size = 120, depth = 120, fill = "#ff4500", accent = "#ffb703" }) {
  const inner = buildFlameFaces({ size, depth, fill, accent });
  return `<div class="candy3d__cube candy3d__cube--flame" style="width:${size}px;height:${size}px;">${inner}</div>`;
}

/* ============================================================
 * 3) DULCES Y CHOCOLATOSOS — "scoop-cluster"
 *    Paleta: Nostalgia Pastel (celeste, rosa, crema, chocolate)
 *    Técnica: "esferas" falsas (border-radius:50% + radial-gradient
 *    para el brillo) posicionadas en 3D como una bola de helado con
 *    varias bochas, igual que las caras del cubo pero circulares.
 * ============================================================ */
function buildScoopFaces({ size, fill, accent, scoops }) {
  return scoops
    .map(({ tx, ty, tz, scale, tone }) => {
      const d = (size * scale).toFixed(1);
      const bg = tone === "accent" ? accent : fill;
      return `<div class="candy3d__face candy3d__face--scoop" style="width:${d}px;height:${d}px;border-radius:50%;transform:translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px);background:radial-gradient(circle at 30% 28%, #ffffffcc, ${bg} 72%);"></div>`;
    })
    .join("");
}

function buildScoopCluster({ size = 120, fill = "#7ec8e3", accent = "#f7b8d0" }) {
  const r = size * 0.32;
  const scoops = [
    { tx: 0, ty: 0, tz: 0, scale: 0.62, tone: "fill" },
    { tx: -r, ty: -r * 0.4, tz: r * 0.4, scale: 0.5, tone: "accent" },
    { tx: r, ty: -r * 0.6, tz: -r * 0.2, scale: 0.46, tone: "fill" },
    { tx: 0, ty: -r * 1.3, tz: 0, scale: 0.4, tone: "accent" },
  ];
  const inner = buildScoopFaces({ size, fill, accent, scoops });
  return `<div class="candy3d__cube candy3d__cube--scoops" style="width:${size}px;height:${size}px;">${inner}</div>`;
}

/* ============================================================
 * 4) ÁCIDOS Y SALADOS — "gem-bipyramid"
 *    Paleta: Contraste Eléctrico (morado #9d00ff / amarillo #fff200)
 *    Reemplaza el cubo plano por un cristal facetado (bipirámide de
 *    N lados): más parecido al cúmulo de cristal morado del render.
 *    Cada faceta es un triángulo (clip-path) en vez de un cuadrado,
 *    manteniendo el mismo mecanismo de translate3d + rotateY/rotateX.
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
    const tone = i % 2 ? fill : accent;
    const toneAlt = i % 2 ? accent : fill;

    const top = `<div class="candy3d__face candy3d__face--facet" style="width:${radius}px;height:${apexY}px;transform:translate3d(${tx}px, ${(-apexY / 2).toFixed(1)}px, ${tz}px) rotateY(${angle}deg) rotateX(35deg);background:${tone};clip-path:polygon(50% 0%, 0% 100%, 100% 100%);"></div>`;
    const bottom = `<div class="candy3d__face candy3d__face--facet" style="width:${radius}px;height:${apexY}px;transform:translate3d(${tx}px, ${(apexY / 2).toFixed(1)}px, ${tz}px) rotateY(${angle}deg) rotateX(-35deg);background:${toneAlt};clip-path:polygon(50% 100%, 0% 0%, 100% 0%);"></div>`;
    return top + bottom;
  }).join("");
}

function buildGemBipyramid({ size = 120, depth = 120, fill = "#9d00ff", accent = "#fff200" }) {
  const inner = buildBipyramidFaces({ size, depth, fill, accent });
  return `<div class="candy3d__cube candy3d__cube--gem" style="width:${size}px;height:${size}px;">${inner}</div>`;
}

/* ============================================================
 * 5) GOMAS DE MASCAR Y GOMITAS — "gummy-ring"
 *    Paleta: Cultura Pop y Neón (rosa neón / verde neón)
 *    Técnica: dos "toros" (aros) segmentados, cada uno una corona de
 *    círculos pequeños (mismo truco de "caras en círculo" que el
 *    prisma, pero con divs redondos en vez de rectángulos), rotados
 *    y desplazados entre sí para que se vean entrelazados.
 * ============================================================ */
function buildRingSegmentFaces({ size, fill, accent, segments = 14 }) {
  const radius = size / 2;
  const tube = size * 0.22;
  const angleStep = 360 / segments;

  return Array.from({ length: segments }, (_, i) => {
    const angle = angleStep * i;
    const rad = (angle * Math.PI) / 180;
    const tx = (Math.sin(rad) * radius).toFixed(2);
    const ty = (Math.cos(rad) * radius * 0.35).toFixed(2); // aplana a elipse (perspectiva)
    const tone = i % 3 === 0 ? accent : fill;
    return `<div class="candy3d__face candy3d__face--gummy" style="width:${tube.toFixed(1)}px;height:${tube.toFixed(1)}px;border-radius:50%;transform:translate3d(${tx}px, ${ty}px, 0px) rotateZ(${angle}deg);background:${tone};box-shadow:inset 0 0 0 2px #ffffff33;"></div>`;
  }).join("");
}

function buildGummyRing({ size = 120, depth = 60, fill = "#ff2d95", accent = "#7cfc00" }) {
  const ringA = buildRingSegmentFaces({ size, fill, accent });
  const ringB = buildRingSegmentFaces({ size: size * 0.85, fill: accent, accent: fill });
  return `
    <div class="candy3d__cube candy3d__cube--ring-a" style="width:${size}px;height:${size}px;">${ringA}</div>
    <div class="candy3d__cube candy3d__cube--ring-b" style="width:${size}px;height:${size}px;transform:translate3d(${(size * 0.25).toFixed(1)}px, ${(size * 0.1).toFixed(1)}px, ${(depth * 0.3).toFixed(1)}px) rotateY(35deg);">${ringB}</div>
  `;
}

/* ============================================================
 * REGISTRO — mismo estilo que tu GEOMETRY_DEFAULTS existente
 * (línea ~12: "cube-powder": { faces: 6, size: 120, depth: 120 })
 * ============================================================ */
const GEOMETRY_DEFAULTS = {
  "cube-powder": { faces: 6, size: 120, depth: 120 }, // legado, se mantiene por compatibilidad
  "mazapan-disc": { size: 130, depth: 26, wedges: 8 },
  "flame-cone": { size: 120, depth: 120, tiers: 5 },
  "scoop-cluster": { size: 120, depth: 120 },
  "gem-bipyramid": { size: 120, depth: 120, sides: 6 },
  "gummy-ring": { size: 120, depth: 60, segments: 14 },
};

/* Dispatcher: qué geometría + colores usa cada categoría en renderCandy3D */
const CATEGORY_GEOMETRY = {
  tradicionales: { geometry: "mazapan-disc", fill: "#e8c39e", accent: "#b5804a" },
  picantes: { geometry: "flame-cone", fill: "#ff4500", accent: "#ffb703" },
  dulces: { geometry: "scoop-cluster", fill: "#7ec8e3", accent: "#f7b8d0" },
  acidos: { geometry: "gem-bipyramid", fill: "#9d00ff", accent: "#fff200" },
  gomas: { geometry: "gummy-ring", fill: "#ff2d95", accent: "#7cfc00" },
};

/* Builders por nombre de geometría, para que renderCandy3D
   solo tenga que hacer: BUILDERS[geometry](config) */
const BUILDERS = {
  "mazapan-disc": buildMazapanDisc,
  "flame-cone": buildFlameCone,
  "scoop-cluster": buildScoopCluster,
  "gem-bipyramid": buildGemBipyramid,
  "gummy-ring": buildGummyRing,
};

module.exports = {
  buildPrismFaces,
  buildMazapanFaces,
  buildMazapanDisc,
  buildFlameFaces,
  buildFlameCone,
  buildScoopFaces,
  buildScoopCluster,
  buildBipyramidFaces,
  buildGemBipyramid,
  buildRingSegmentFaces,
  buildGummyRing,
  GEOMETRY_DEFAULTS,
  CATEGORY_GEOMETRY,
  BUILDERS,
};
