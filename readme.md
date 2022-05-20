## vite-plugin-list-directory-contents

A small vite plugin to list your directory contents.

**Why?** In development mode, vite will allow you to have as many inputs as you want, simply run `vite .` and the current folder will be served up. Clicking any `.html` files will be compiled by vite (vited?). So, rather than manually type in the paths to all your inputs, this will list all your files so you can click them with ease. Like the good 'ol `Index Of /` days.


### How to use:

1. `npm i vite vite-plugin-list-directory-contents`
2. create a `vite.config.ts` (or .js) like this:

```ts
import { defineConfig } from 'vite';
import { directoryPlugin } from 'vite-plugin-list-directory-contents';

export default defineConfig({
  plugins: [
    directoryPlugin({ baseDir: __dirname })
  ],
});
```

3. go ahead and run `vite` from your cli, or set a `"dev": "vite"` in your `package.json scripts"

## Config

directoryPlugin has two arguments:

1. `baseDir` - where do you want to serve the files up from? __dirname is a good choice, but you can set to a subfolder.
2. `filterList` - an array of files to filter out. Defaults to `['.DS_Store', 'package.json', 'package-lock.json', 'node_modules', '.parcelrc', '.parcel-cache', 'dist', 'packages'];`






