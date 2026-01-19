import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: true,
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
      }),
      sentryVitePlugin({
        org: "Yunji",
        project: "javascript-react",
        authToken: env.SENTRY_AUTH_TOKEN,
      }),
    ],
    resolve: {
      alias: [
        { find: "@", replacement: "/src" },
        { find: "@routes", replacement: "/src/routes" },
        { find: "@styles", replacement: "/src/styles" },
        { find: "@assets", replacement: "/src/assets" },
        { find: "@components", replacement: "/src/components" },
        { find: "@stores", replacement: "/src/stores" },
        { find: "@utils", replacement: "/src/utils" },
        { find: "@types", replacement: "/src/types" },
      ],
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        input: "/index.html",
      },
    },
    base: "/",
    server: {
      port: 3000,
    },
  };
});
