import { defineConfig } from "vite";

function fromConfigRoot(relativePath: string) {
  const pathname = decodeURIComponent(new URL(relativePath, import.meta.url).pathname);
  return pathname.replace(/^\/([A-Za-z]:\/)/, "$1");
}

export default defineConfig({
  cacheDir: process.env.PERSONA_VITE_CACHE_DIR ?? fromConfigRoot("./.cache/vite-local"),
  resolve: {
    alias: {
      "@": fromConfigRoot("./src")
    },
    dedupe: ["react", "react-dom", "react-router-dom"]
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-dev-runtime", "react-router-dom"]
  },
  server: {
    host: "0.0.0.0",
    port: parseInt(process.env.VITE_PORT ?? "3000")
  }
});
