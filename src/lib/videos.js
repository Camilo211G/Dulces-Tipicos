// Videos por categoría — un clip por categoría en assets/videos.
// El poster es un frame extraído del propio mp4 (assets/videos/posters).
// Los .vtt son descripciones Subtítulos del material generado con IA.

export const CATEGORY_VIDEOS = {
  tradicionales: {
    file: "mp4Obleas.mp4",
    poster: "mp4Obleas.jpg",
    label: "Obleas con Cajeta",
    duracion: "0:10",
    descripcion:
      "Dos manos colocan una galleta de wafer sobre una oblea untada de cajeta; después se ven las obleas ya selladas avanzando en banda, la máquina que las forma y el empaque final en sobres.",
  },
  picantes: {
    file: "mp4Pulparindo.mp4",
    poster: "mp4Pulparindo.jpg",
    label: "Pulparindo",
    duracion: "0:10",
    descripcion:
      "Una mezcladora industrial bate chocolate con trozos de tamarindo; la pasta se lamina, se corta en barras y se envuelve en sobres amarillos con la marca Pulparindo.",
  },
  dulces: {
    file: "mp4Mazapan.mp4",
    poster: "mp4Mazapan.jpg",
    label: "Mazapán de la Rosa",
    duracion: "0:10",
    descripcion:
      "Cacahuates caen en un tostador y se muelen con azúcar hasta formar la masa del mazapán; luego los discos se envuelven en papel y avanzan ya embolsados en aluminio.",
  },
  acidos: {
    file: "mp4Limon7.mp4",
    poster: "mp4Limon7.jpg",
    label: "Limón 7",
    duracion: "0:10",
    descripcion:
      "Azúcar y polvo de limón se vierten en una mezcladora y se amasan con trozos de fruta; el producto se embolsa en sobres verdes de Limón 7 que avanzan en la línea de empaque.",
  },
  gomas: {
    file: "mp4Panditas.mp4",
    poster: "mp4Panditas.jpg",
    label: "Panditas",
    duracion: "0:10",
    descripcion:
      "Una cuba de jarabe se bate y una máquina vierte la gelatina de colores en moldes con forma de osito; las gomitas terminadas se embolsan en sobres verdes y pasan por la línea de empaque.",
  },
};

export function getCategoryVideo(slug) {
  const entry = CATEGORY_VIDEOS[slug];
  if (!entry) return null;
  return {
    src: `/assets/videos/${entry.file}`,
    poster: `/assets/videos/posters/${entry.poster}`,
    vtt: `/assets/videos/${entry.file.replace(/\.mp4$/, ".vtt")}`,
    label: entry.label,
    duracion: entry.duracion,
    descripcion: entry.descripcion,
  };
}
