## vite-plugin-list-directory-contents

A small vite plugin to list your directory contents.

**Why?** In development mode, vite will allow you to have as many inputs as you want, simply run `vite .` and the current folder will be served up. So, rather than manually type in the paths to all your inputs, this will list all your files so you can click them with ease. Like the good 'ol `Index Of /` days.


### How to use:

1. `npm i vite-plugin-list-directory-contents`
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

3.



