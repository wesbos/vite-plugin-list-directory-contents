import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './plugin.ts',
      name: 'vite-plugin-list-directory-contents'
    }
  }
});
