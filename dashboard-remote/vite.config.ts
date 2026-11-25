import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "dashboard_remote",
      filename: "remoteEntry.js",
      exposes: { "./Dashboard": "./src/Dashboard.tsx" },
      shared: ["react", "react-dom", "@lendistry/openfeature"],
    }),
  ],
  server: { host: "0.0.0.0", port: 3001, strictPort: true },
  preview: { host: "0.0.0.0", port: 3001, strictPort: true },
  build: { target: "esnext", minify: false, cssCodeSplit: false },
});
