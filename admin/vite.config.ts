import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "/admin/", // ✅ IMPORTANT FIX

  server: {
    port: 3002,
    watch: {
      ignored: ["**/.history/**"],
    },
  },

  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
});