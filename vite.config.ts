import preact from "@preact/preset-vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/games/",
  build: {
    outDir: "dist/games",
  },
  plugins: [
    preact(),
    vanillaExtractPlugin(),
    VitePWA({
      registerType: "prompt",
      includeAssets: [
        "icon.svg",
        "icon-64.png",
        "icon-180.png",
        "icon-180-maskable.png",
        "icon-192.png",
        "icon-512.png",
        "icon-512-maskable.png",
      ],
      manifest: {
        name: "Pocket Games",
        short_name: "Pocket Games",
        description: "A collection of local pass-and-play games.",
        display: "standalone",
        background_color: "#f4f7f6",
        theme_color: "#f4f7f6",
        icons: [
          {
            src: "icon-64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
