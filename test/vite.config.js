import { defineConfig } from "vite";
import directoryIndex from "vite-plugin-directory-index";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    fs: {
      allow: ["not-index.html", "package.json", "folder", "exclude-me.txt"],
      deny: ["exclude-me.txt"],
    },
  },
  plugins: [directoryIndex()],
});
