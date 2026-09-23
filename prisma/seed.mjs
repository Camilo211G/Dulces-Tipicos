// Dulce — Seed: 5 categorías y 40 dulces desde DESIGN-candys.md
// Ejecutar con: npm run db:seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categorias = [
  {
    slug: "tradicionales",
    nombre: "Tradicionales y Artesanales",
    eyebrow: "Paleta — Identidad Patria",
    descripcion:
      "Verde bandera, blanco puro y rojo carmín. Esta paleta representa los colores patrios, el origen de los ingredientes (semillas, leche, frutas) y los listones tricolores con los que se envuelven estos dulces en los mercados típicos.",
    colorPrimary: "#0a8a3a",
    colorSecondary: "#ffffff",
    colorAccent: "#d62828",
    orden: 1,
    dulces: [
      ["Obleas con Cajeta", "Discos de harina de trigo rellenos de dulce de leche de cabra.", "mazapan-disc", "obleas-con-cajeta"],
      ["Alegrías", "Semillas de amaranto tostado unidas con miel de agave o piloncillo.", null, "alegrias"],
      ["Palanquetas", "Bloque crujiente de cacahuates enteros bañados en caramelo endurecido.", null, "palanquetas"],
      ["Cocadas", "Coco rallado horneado con leche y azúcar, a menudo pintadas de colores.", null, "cocadas"],
      ["Borrachitos", "Rollitos de harina y azúcar espolvoreada con un toque de licor.", null, "borrachitos"],
      ["Ate (Membrillo/Guayaba)", "Pasta dulce y densa de fruta, ideal para acompañar con queso.", null, "ate-membrillo-guayaba"],
      ["Jamoncillo", "Dulce de leche finamente cristalizado, a menudo decorado con nuez.", null, "jamoncillo"],
      ["Merengues Mexicanos", "Claras de huevo batidas y horneadas, de color rosa vibrante o blanco.", null, "merengues-mexicanos"],
      ["Tarugos", "Bolitas de pulpa de tamarindo natural revolcadas en azúcar.", null, "tarugos"],
      ["Macarrones", "Suaves tubos estriados hechos a base de leche quemada (cajeta).", null, "macarrones"],
    ],
  },
  {
    slug: "picantes",
    nombre: "Picantes y Enchilados",
    eyebrow: "Paleta — Fuego Azteca",
    descripcion:
      "Rojo intenso y naranja fuego. El rojo alerta a los sentidos sobre el picor del chile (guajillo, árbol, piquín), mientras que el naranja evoca la acidez del tamarindo y el chamoy que hace agua la boca.",
    colorPrimary: "#c1121f",
    colorSecondary: "#ff6b1a",
    colorAccent: "#7a0d10",
    orden: 2,
    dulces: [
      ["Pulparindo", "La icónica barra de tamarindo salado, ácido y picante.", "flame-cone", "pulparindo"],
      ["Pelón Pelo Rico", "Jalea de tamarindo enchilado que se empuja por una jeringa.", null, "pelon-pelo-rico"],
      ["Pica Fresa", "Goma de mascar sabor fresa cubierta de una costra de chile y chamoy.", null, "pica-fresa"],
      ["Rockaleta", "Paleta de múltiples capas alternas de chile y dulce, con centro de chicle.", null, "rockaleta"],
      ["Skwinkles (Salsagheti)", "Tiras de goma sabor sandía/piña acompañadas de salsa de chamoy.", null, "skwinkles-salsagheti"],
      ["Lucas Muecas", "Paleta de caramelo (fresa, pepino, mango) para sumergir en chile en polvo.", null, "lucas-muecas"],
      ["Tamborines", "Pequeños discos compactos de tamarindo con chile y sal.", null, "tamborines"],
      ["Super Rebanaditas", "Paletas de caramelo macizo en forma de sandía cubiertas de chile.", null, "super-rebanaditas"],
      ["Locochas", "Caramelos macizos de frutas con un centro líquido y muy picante.", null, "locochas"],
      ["Cucharitas de Tamarindo", "Pasta de tamarindo enchilado servida directamente en cucharas de plástico.", null, "cucharitas-de-tamarindo"],
    ],
  },
  {
    slug: "dulces",
    nombre: "Dulces y Chocolatosos",
    eyebrow: "Paleta — Nostalgia Pastel",
    descripcion:
      "Azul cielo, rosa pastel y toques de amarillo dorado. Estos colores evocan inocencia, fiestas infantiles y el dulzor suave de la vainilla, el malvavisco, el chocolate y el algodón de azúcar.",
    colorPrimary: "#7ec8e3",
    colorSecondary: "#f4c2d7",
    colorAccent: "#f6c453",
    orden: 3,
    dulces: [
      ["Mazapán de la Rosa", "Polvo de cacahuate tostado y azúcar, famoso por deshacerse fácilmente.", "scoop-cluster", "mazapan-de-la-rosa"],
      ["Paleta Payaso", "Malvavisco cubierto de chocolate con gomitas formando una cara sonriente.", null, "paleta-payaso"],
      ["Duvalín", "Crema untable de sabores combinados (fresa, vainilla, avellana).", null, "duvalin"],
      ["Bubulubu", "Barra en forma de ola con jalea de fresa y malvavisco, cubierta de chocolate.", null, "bubulubu"],
      ["Chocolate Carlos V", 'El "Rey de los Chocolates", barra clásica de chocolate con leche.', null, "chocolate-carlos-v"],
      ["Tutsi Chupa Pop", "Paleta de caramelo rojo sabor cereza con centro de chicle.", null, "tutsi-chupa-pop"],
      ["Bocadín", "Galleta crujiente (wafer) rellena y cubierta de chocolate.", null, "bocadin"],
      ["Winis", "Caramelos masticables y suaves en forma de pequeños cubos frutales.", null, "winis"],
      ["Paleta Manita", "Paleta de caramelo macizo en forma de mano de la suerte, sabor cereza/fresa.", null, "paleta-manita"],
      ["Cachetadas", "Caramelos estirados y delgados como papel, que se doblan para comerse.", null, "cachetadas"],
    ],
  },
  {
    slug: "acidos",
    nombre: "Ácidos y Salados",
    eyebrow: "Paleta — Contraste Eléctrico",
    descripcion:
      "Morado neón y amarillo cítrico. Una combinación estridente y contrastante. El amarillo representa el limón cortante y la sal, mientras que el morado (a menudo uva o mora azul) representa los polvos que fruncen el ceño al probarlos.",
    colorPrimary: "#9d00ff",
    colorSecondary: "#fff200",
    colorAccent: "#1a1a1a",
    orden: 4,
    dulces: [
      ["Limón 7", "Polvito intensamente salado y ácido, diseñado para comerse solo o en botanas.", "gem-bipyramid", "limon-7"],
      ["Lucas Gusano", "Líquido ácido y salado con consistencia de gel (sabor chamoy o limón).", null, "lucas-gusano"],
      ["Tix Tix", "Tubos transparentes llenos de polvos de sabores extremadamente ácidos.", null, "tix-tix"],
      ["Pinta Azul", "Paleta de caramelo macizo que deja la lengua de un intenso color azul/morado.", null, "pinta-azul"],
      ["Pecositas", "Pequeñas grageas de caramelo ácido que explotan en sabor frutal.", null, "pecositas"],
    ],
  },
  {
    slug: "gomas",
    nombre: "Gomas de Mascar y Gomitas",
    eyebrow: "Paleta — Cultura Pop y Neón",
    descripcion:
      "Fucsia vibrante y Verde neón. Introducen la estética plástica y moderna que faltaba frente a los tonos cálidos, terrosos o patrios. El fucsia evoca inmediatamente la elasticidad, el sabor a tutti-frutti y las bombas de chicle a punto de reventar; mientras que el verde neón representa la textura translúcida y gelatinosa de las gomitas, así como los sabores frutales artificiales (como la manzana verde).",
    colorPrimary: "#ff2e93",
    colorSecondary: "#39ff14",
    colorAccent: "#1a1a1a",
    orden: 5,
    dulces: [
      ["Panditas", "Las icónicas gomitas de gelatina en forma de oso, de textura suave y sabores frutales brillantes.", "gummy-ring", "panditas"],
      ["Bubbaloo", "Chicle de globo inconfundible por su explosivo centro de jugo líquido (fresa, menta o mora).", null, "bubbaloo"],
      ["Pica Gomas", "Gomitas esféricas masticables, revolcadas en una capa de chile y azúcar con sabor a fresa o tamarindo.", null, "pica-gomas"],
      ["Chicles Canel's", 'Pequeños cuadritos de chicle macizo (menta, canela, frutas) famosos por ser la "moneda de cambio" en las tienditas.', null, "chicles-canels"],
      ["Chicle Motita", "El nostálgico chicle de barra suave y estirable, famoso por su sabor a plátano y por hacer las bombas más grandes.", null, "chicle-motita"],
    ],
  },
];

async function main() {
  console.log("Limpiando tablas…");
  await prisma.dulce.deleteMany({});
  await prisma.categoria.deleteMany({});

  console.log("Insertando categorías y dulces…");
  let popularidad = 1;
  for (const cat of categorias) {
    const created = await prisma.categoria.create({
      data: {
        slug: cat.slug,
        nombre: cat.nombre,
        eyebrow: cat.eyebrow,
        descripcion: cat.descripcion,
        colorPrimary: cat.colorPrimary,
        colorSecondary: cat.colorSecondary,
        colorAccent: cat.colorAccent,
        orden: cat.orden,
      },
    });

    for (const [nombre, ingredientes, geometria3d, imageSlug] of cat.dulces) {
      await prisma.dulce.create({
        data: {
          popularidad,
          nombre,
          ingredientes,
          geometria3d,
          esEmblematico: geometria3d !== null,
          imageSlug: imageSlug ?? null,
          categoriaId: created.id,
        },
      });
      popularidad += 1;
    }
    console.log(`  ✓ ${cat.nombre} (${cat.dulces.length} dulces)`);
  }

  const totalCats = await prisma.categoria.count();
  const totalDulces = await prisma.dulce.count();
  console.log(`\nListo: ${totalCats} categorías, ${totalDulces} dulces.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
