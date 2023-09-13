# Directory index plugin for Vite

📂 Directory index plugin for the Vite dev server

<p align=center>
  <img src="https://i.imgur.com/TNMoGhn.png">
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

❤️ There are currently no options available. If you need any, please open an
Issue! I'd love to hear your feedback.

[Vite]: https://vitejs.dev/
