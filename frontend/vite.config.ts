import { resolve } from "node:path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    // base: "./",
    // root: "./src",
    build: {
        outDir: resolve(__dirname, "dist"),
        emptyOutDir: true,
    },
    plugins: [tsconfigPaths(), react()],

    server: {
        host: true,
        proxy: {
            "/api": {
                target: "http://backend:3000",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, "/api"),
            },
        },
    },
});
