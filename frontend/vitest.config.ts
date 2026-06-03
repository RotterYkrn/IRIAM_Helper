import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        environment: "jsdom",
        globals: true,
        include: ["tests/**/*.test.ts"],
        setupFiles: "./vitest.setup.ts",
        // coverage: {            // カバレッジ設定 (オプション)
        //   reporter: ['text', 'json', 'html'],
        // },
    },
});
