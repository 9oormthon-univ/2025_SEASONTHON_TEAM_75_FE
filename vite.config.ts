import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      { find: "@routes", replacement: path.resolve(__dirname, "src/routes") },
      { find: "@styles", replacement: path.resolve(__dirname, "src/styles") },
      { find: "@assets", replacement: path.resolve(__dirname, "src/assets") },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "src/components"),
      },
      { find: "@stores", replacement: path.resolve(__dirname, "src/stores") },
      { find: "@utils", replacement: path.resolve(__dirname, "src/utils") },
    ],
  },
});
