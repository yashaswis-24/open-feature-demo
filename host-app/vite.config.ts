import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host_app",
      remotes: {
        dashboard_remote: "http://localhost:3001/assets/remoteEntry.js",
        loan_remote: "http://localhost:3002/assets/remoteEntry.js",
      },
      shared: ["react", "react-dom", "@lendistry/openfeature"],
    }),
  ],
  server: { host: "0.0.0.0", port: 3000, strictPort: true },
  preview: { host: "0.0.0.0", port: 3000, strictPort: true },
  build: { target: "esnext", minify: false, cssCodeSplit: false },
});
