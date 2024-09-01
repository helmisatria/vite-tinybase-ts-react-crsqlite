import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": process.env,
  },
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    exclude: ["@vite/client", "@vite/env", "@vlcn.io/crsqlite-wasm"],
    esbuildOptions: {
      target: "esnext",
    },
  },
  plugins: [
    react(),
    // VitePWA({
    //   workbox: {
    //     globPatterns: [
    //       "**/*.js",
    //       "**/*.css",
    //       "**/*.svg",
    //       "**/*.html",
    //       "**/*.png",
    //       "**/*.wasm",
    //     ],
    //   },
    // }),
  ],
  server: {
    fs: {
      strict: false,
    },
  },
});
