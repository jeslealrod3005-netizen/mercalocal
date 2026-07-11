import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      // Evita problemas de CORS en desarrollo: /api -> backend Express
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
