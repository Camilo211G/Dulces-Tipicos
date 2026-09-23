// Dulce — Express server
// Endpoints: GET /api/categorias  |  GET /api/categorias/:slug

import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "dulce-api" });
});

app.get("/api/categorias", async (_req, res, next) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { orden: "asc" },
      include: {
        dulces: {
          orderBy: { popularidad: "asc" },
          select: {
            id: true,
            popularidad: true,
            nombre: true,
            ingredientes: true,
            geometria3d: true,
            esEmblematico: true,
            imageSlug: true,
          },
        },
      },
    });
    res.json({ categorias });
  } catch (err) {
    next(err);
  }
});

app.get("/api/categorias/:slug", async (req, res, next) => {
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { slug: req.params.slug },
      include: {
        dulces: {
          orderBy: { popularidad: "asc" },
          select: {
            id: true,
            popularidad: true,
            nombre: true,
            ingredientes: true,
            geometria3d: true,
            esEmblematico: true,
            imageSlug: true,
          },
        },
      },
    });
    if (!categoria) return res.status(404).json({ error: "Categoria no encontrada" });
    res.json({ categoria });
  } catch (err) {
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  console.error("[api error]", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`[dulce-api] escuchando en http://127.0.0.1:${PORT}`);
});
