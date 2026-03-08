import { resolve } from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import pkg from "./package.json" with { type: "json" };

export default defineConfig({
    build: {
        outDir: resolve(__dirname, "dist"),
        emptyOutDir: true,
        // rollupOptions: {
        //     output: {
        //         manualChunks: (id) => {
        //             // node_modules 内のライブラリを分割
        //             if (id.includes("node_modules")) {
        //                 // React 関連をまとめる
        //                 if (id.includes("react")) {
        //                     return "vendor-react";
        //                 }
        //                 // Effect 関連をひとまとめにする（@effect/schema なども含まれる）
        //                 if (id.includes("effect")) {
        //                     return "vendor-effect";
        //                 }
        //                 // それ以外の重いライブラリ
        //                 return "vendor-others";
        //             }

        //             return;
        //         },
        //     },
        // },
    },
    plugins: [tsconfigPaths(), react(), tailwindcss()],
    define: { "import.meta.env.PACKAGE_VERSION": JSON.stringify(pkg.version) },
});
