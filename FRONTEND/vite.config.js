import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import PWA_JSON_FILE from "./config/icons.json";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    cors: {
      origin: "*",
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{html,js,css,png,jpg,jpeg,svg}"],
      },
      manifest: {
        name: "HomeX",
        short_name: "HomeX",
        description: "HomeX description",
        theme_color: "#007",
        background_color: "#000",
        start_url: "/",
        display: "standalone",
        icons: PWA_JSON_FILE.icons,
      },
    }),
  ],
});
