import { defineConfig } from 'vite';
// import { directoryPlugin } from '../../dist/plugin.cjs';
// import { directoryPlugin } from './plugin.cjs';
import { lol } from './wtf.cjs'
console.log(lol);



export default defineConfig({
  plugins: [
    // directoryPlugin({ baseDir: __dirname })
  ],
});
