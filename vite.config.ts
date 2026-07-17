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
      includeAssets: ["icon.svg"],
      manifest: {
        name: "Games",
        short_name: "Games",
        description: "A collection of local pass-and-play games.",
        display: "standalone",
        background_color: "#f4f7f6",
        theme_color: "#f4f7f6",
        icons: [
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
