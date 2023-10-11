# Directory index plugin for Vite

📂 Directory index plugin for the Vite dev server

<p align=center>
  <img src="https://i.imgur.com/vhzjfm3.png">
</p>

⚡ Works with [Vite] \
📂 Great for `test/my-test.html` project layouts \
🖥️ Rendered on the server only in development \
📦 Doesn't affect your build output

## Installation

```sh
npm install vite-plugin-directory-index
```

## Usage

```js
// vite.config.js
import { defineConfig } from "vite";
import directoryIndex from "vite-plugin-directory-index";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [directoryIndex()],
});
```

### Options

This plugin **respects [the `server.fs` options]**. Other than that, there's no available configuration. If you have need a config option, [open an Issue]!

[Vite]: https://vitejs.dev/
[the `server.fs` options]: https://vitejs.dev/config/server-options.html#server-fs-strict
[open an issue]: https://github.com/jcbhmr/vite-plugin-directory-index/issues
