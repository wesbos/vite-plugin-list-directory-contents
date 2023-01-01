import { defineConfig } from 'vite';
import { directoryPlugin } from '../plugin';

export default defineConfig({
  plugins: [
    directoryPlugin({ baseDir: __dirname })
  ],
});
