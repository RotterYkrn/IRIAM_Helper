import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        include: ["tests/**/*.test.ts"],
        // coverage: {            // カバレッジ設定 (オプション)
        //   reporter: ['text', 'json', 'html'],
        // },
    },

    plugins: [tsconfigPaths()],
});
