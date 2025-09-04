import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@routes", replacement: "/src/routes" },
      { find: "@styles", replacement: "/src/styles" },
      { find: "@assets", replacement: "/src/assets" },
      { find: "@components", replacement: "/src/components" },
      { find: "@stores", replacement: "/src/stores" },
      { find: "@utils", replacement: "/src/utils" },
    ],
  },
  build: {
    rollupOptions: {
      input: "/index.html",
    },
  },
  server: {
    port: 3000,
  },
});
