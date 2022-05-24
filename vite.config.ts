import { defineConfig } from "vite";
import dts from "vite-dts";
import { directoryPlugin } from "./plugin";

export default defineConfig({
  build: {
    lib: {
      entry: "plugin.ts",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "plugin.mjs" : "plugin.js"),
    },
    rollupOptions: {
      external: ["path", "fs", "fs/promises"],
    },
    target: "esnext",
    minify: false,
  },
  plugins: [dts(), directoryPlugin({ baseDir: __dirname })],
});
