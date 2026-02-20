import { resolve } from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import pkg from "./package.json" assert { type: "json" };

export default defineConfig({
    build: {
        outDir: resolve(__dirname, "dist"),
        emptyOutDir: true,
    },
    plugins: [tsconfigPaths(), react(), tailwindcss()],
    define: { "import.meta.env.PACKAGE_VERSION": JSON.stringify(pkg.version) },
});
