import { resolve } from "node:path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    build: {
        outDir: resolve(__dirname, "dist"),
        emptyOutDir: true,
    },
    plugins: [tsconfigPaths(), react()],
});
