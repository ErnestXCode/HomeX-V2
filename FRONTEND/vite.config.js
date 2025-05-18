import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

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
      registerType: "autoUpdate", // Automatically update the service worker
      workbox: {
        globPatterns: ["**/*.{html,js,css,png,jpg,jpeg,svg}"], // Files to cache
      },
      manifest: {
        name: "My PWA App", // Name of your app
        short_name: "PWA", // Short name for app on home screen
        description:
          "A Progressive Web App built with Vite, React, and Tailwind CSS",
        theme_color: "#333", // Theme color of the app
        background_color: "#333", // Background color of the app
        start_url: "/", // Start URL of the PWA
        display: "standalone", // Display mode (like a native app)
        icons: [
          {
            src: "./src/assets/pwa-images/android-launchericon-192-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./src/assets/pwa-images/android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
