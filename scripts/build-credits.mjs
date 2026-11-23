// Genera src/lib/credits.js a partir de assets/images/CREDITS.md
// Uso: node scripts/build-credits.mjs
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "assets/images/CREDITS.md";
const OUT = "src/lib/credits.js";

const ATRIB =
  /^- \*\*(?<slug>[\w-]+)\*\* \((?<path>[^)]+)\) — "(?<titulo>[^"]+)" → autor: \[(?<autor>[^\]]+)\]\((?<autorUrl>[^)]+)\) · \[fuente\]\((?<fuenteUrl>[^)]+)\) · (?<licencia>[^(]+)\((?<licenciaUrl>[^)]+)\)/;
const PROPIA =
  /^- \*\*(?<slug>[\w-]+)\*\* \((?<path>[^)]+)\) — "(?<titulo>[^"]+)" → (?<nota>.+)$/;

const texto = readFileSync(SRC, "utf8");
const items = [];
let seccion = "foto";

for (const linea of texto.split("\n")) {
  if (linea.startsWith("## ")) {
    seccion = linea.includes("propias")
      ? "ilustracion"
      : linea.includes("pendiente")
        ? "pendiente"
        : "foto";
    continue;
  }
  const m = linea.match(ATRIB);
  if (m) {
    const g = m.groups;
    items.push({
      slug: g.slug,
      imagen: `/assets/images/${g.path}`,
      titulo: g.titulo,
      tipo: "foto",
      autor: g.autor,
      autorUrl: g.autorUrl === "None" ? null : g.autorUrl,
      fuente: g.fuenteUrl,
      licencia: g.licencia.trim(),
      licenciaUrl: g.licenciaUrl,
    });
    continue;
  }
  const p = linea.match(PROPIA);
  if (p) {
    const g = p.groups;
    items.push({
      slug: g.slug,
      imagen: `/assets/images/${g.path}`,
      titulo: g.titulo,
      tipo: seccion,
      nota: g.nota.trim(),
    });
  }
}

const salida = `// Generado por scripts/build-credits.mjs desde ${SRC}
// Edita el .md y vuelve a correr: node scripts/build-credits.mjs

export const CREDITOS = ${JSON.stringify(items, null, 2)};

export const LICENCIAS = [
${[...new Set(items.filter((i) => i.licencia).map((i) => i.licencia))]
  .map((l) => `  "${l}",`)
  .join("\n")}
];
`;

writeFileSync(OUT, salida);
console.log(
  `${items.length} atribuciones escritas en ${OUT} (fotos: ${
    items.filter((i) => i.tipo === "foto").length
  }, propias: ${items.filter((i) => i.tipo === "ilustracion").length}, pendientes: ${
    items.filter((i) => i.tipo === "pendiente").length
  })`
);
