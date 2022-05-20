import { defineConfig } from "vite";
import dts from "vite-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "plugin.ts",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["path", "fs", "fs/promises"],
    },
    target: "esnext",
    minify: false,
  },
  plugins: [dts()],
});
