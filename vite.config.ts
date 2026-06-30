import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  server: {
    open: true,
    host: "0.0.0.0",
  },
  plugins: [
    vue(),
    svgLoader(),
    viteSingleFile(),
  ],
  build: {
    minify: false,
    outDir: "docs",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
