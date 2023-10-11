import { defineConfig } from "vite";
import directoryIndex from "vite-plugin-directory-index";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    fs: {
      allow: ["not-index.html", "folder", ".env.example"],
      deny: ["exclude-me.txt"]
    }
  },
  plugins: [directoryIndex()],
});
