import { defineConfig } from "vite";
import { cp } from "node:fs/promises";

export default defineConfig({
  root: ".",
  appType: "spa",
  server: {
    port: 5173,
    strictPort: true,
    host: "127.0.0.1",
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: "index.html",
        privacidad: "privacidad.html",
        creditos: "creditos.html",
      },
    },
  },
  plugins: [
    {
      // Copia imágenes, videos, tipografías y el logo SVG al dist final:
      // el sitio los referencia con rutas absolutas (/assets/...).
      name: "dulce-static-assets",
      apply: "build",
      async closeBundle() {
        await cp("assets", "dist/assets", {
          recursive: true,
          // fonts/ y svg/ los empaqueta Vite (con hash); aquí sólo van los
          // archivos que el sitio referencia en tiempo de ejecución.
          filter: (src) =>
            !src.includes("claude-designs") &&
            !src.includes("fonts") &&
            !src.includes("svg"),
        });
      },
    },
  ],
});
