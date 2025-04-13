import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": "http://localhost:5000",
      "/uploads/": "http://localhost:5000",
    },
  },
  resolve: {
    alias: {
      "@frontend": path.resolve(__dirname, "../frontend/src"), // Chỉ đến `frontend/src`
      "@config": path.resolve(__dirname, '../config.js')
    },
  },
});
