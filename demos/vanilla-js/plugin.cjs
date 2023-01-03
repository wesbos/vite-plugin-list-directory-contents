var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// plugin.ts
var plugin_exports = {};
__export(plugin_exports, {
  directoryPlugin: () => directoryPlugin
});
module.exports = __toCommonJS(plugin_exports);
var path = __toESM(require("path"), 1);
var import_promises = require("fs/promises");
var import_code_icons = require("@wesbos/code-icons");
function makeListFromDirectory(directoryListing, base, filters) {
  const links = directoryListing.reduce((acc, file) => {
    if (file.isDirectory()) {
      acc[0].push(file);
    } else {
      acc[1].push(file);
    }
    return acc;
  }, [[], []]).flat().filter((dirent) => !filters.includes(dirent.name)).map((file) => {
    const icon = file.isDirectory() ? (0, import_code_icons.getIconForFolder)(file.name) : (0, import_code_icons.getIconForFile)(file.name);
    const { svg } = (0, import_code_icons.getSVGStringFromFileType)(icon);
    return `<li>
        <a data-filename="${file.name}" href="${base === "/" ? "" : base}/${file.name === "index.html" ? "." : file.name}">
          ${svg}
          ${file.name}
        </a>
        </li>`;
  }).join("");
  return links;
}
var fallbackHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Vite Dev Server</title>
    <link rel="icon" href="https://fav.farm/\u{1F525}" />
  </head>
  <body>
    <!--
      This file was Generated for you by the vite-plugin-list-directory-contents plugin.
      You can edit anything in here. Just leave the DIRECTORY tag where you want the directory listing to go.

      \u2764\uFE0F @wesbos
    -->
    {%DIRECTORY%}
  </body>
</html>`;
function directoryPlugin({ baseDir, filterList }) {
  if (!filterList) {
    filterList = [".DS_Store", "package.json", "package-lock.json", "node_modules", ".parcelrc", ".parcel-cache", "dist", "packages", ".git", ".eslintrc", ".gitignore", ".npmrc", "tsconfig.json", "vite.config.ts", ".env", "development.env", "production.env"];
  }
  const plugin = {
    name: "vite-plugin-list-directory-contents",
    apply: "serve",
    handleHotUpdate({ server, file }) {
      const folder = path.dirname(file.replace(baseDir, ""));
      const filename = path.basename(file);
      server.ws.send("vite:directoryChanged", { file, __dirname, baseDir, folder, filename });
    },
    async configureServer(server) {
      const indexPath = path.join(baseDir, "index.html");
      let indexExists = false;
      try {
        await (0, import_promises.access)(indexPath);
        indexExists = true;
      } catch (err) {
        setTimeout(() => {
          console.log("\x1B[33m%s\x1B[0m", `\u26A1\uFE0F [vite-plugin-list-directory-contents]: No index.html found in baseDir.
\u26A1\uFE0F Don't worry! We will now make you one for you at
\u26A1\uFE0F ${indexPath}
`);
        }, 1e3);
        await (0, import_promises.writeFile)(indexPath, fallbackHTML);
      }
    },
    async transformIndexHtml(html, ctx) {
      const context = ctx;
      if (!ctx.filename.endsWith("index.html"))
        return html;
      const currentFolder = path.join(baseDir, context.originalUrl.replace("/index.html", ""));
      context.server.watcher.unwatch(currentFolder);
      context.server.watcher.add(currentFolder);
      const directoryListing = await (0, import_promises.readdir)(currentFolder, { withFileTypes: true });
      const fileArray = directoryListing.map((dirent) => dirent.name);
      const listItems = makeListFromDirectory(directoryListing, context.originalUrl, filterList);
      const folder = context.originalUrl;
      return html.replace(
        "{%DIRECTORY%}",
        `<h2>Index Of ${context.originalUrl}</h2>
        <ul>
          ${context.originalUrl === "/" ? "" : '<li><a href="..">\u2B06\uFE0F Up a level</a></li>'}
          ${listItems.length ? listItems : `<li><a href=".">\u{1F47B} It's very quiet in here. Make a file or two and get coding!</a><li>`}
        </ul>
        <style>${css}</style>
        <script type="module">
          import { createHotContext } from '/@vite/client';
          const hot = createHotContext();
          const folder = '${folder}';
          const files = ${JSON.stringify(fileArray)};
          hot.on('vite:directoryChanged', (data) => {
            if(data.folder === folder) {
              // console.log('This hot update has to do with this folder!');
              // did a file just change, or is there a few file?
              if(files.includes(data.filename)) {
                // console.log('This file has changed: ', data.filename);
                // perform custom update
                const el = document.querySelector("[data-filename='" + data.filename + "']");
                el.classList.add('changed');
                setTimeout(() => { el.classList.remove('changed') }, 500);
              } else {
                // console.log('A new file is born!');
                window.location.reload();
              }
            }
          });
        <\/script>
        <!-- \u{1F970} Generated by a Vite Plugin, Made by Wes Bos for Tasty TypeScript-->
        `
      );
    }
  };
  return plugin;
}
var css = `
  html {
    --blue: #193549;
    --yellow: #ffc600;
    --subtle: rgba(255, 255, 255, 0.1);
    margin: 0;
  }
  h2 {
    text-align: center;
  }
  body {
    font-family: 'Operator Mono', 'Dank Mono', 'Fira Code', 'monospace';
    font-weight: 200;
    background: var(--blue);
    color: white;
    font-size: 1.3rem;
  }
  a {
    color: var(--yellow);
    display: block;
    padding: 10px 20px;
    text-decoration: none;
    display: flex;
    gap: 10px;
    align-items: center;
    transition: background 0.2s;
  }
  a.changed {
    background: var(--subtle);
  }
  a:hover {
    background: var(--subtle);
  }
  li {
    border-bottom: 1px solid var(--subtle);
  }
  li svg {
    width: 20px;
  }
  li:last-child {
    border-bottom: none;
  }
  ul {
    margin: 0;
    margin: 0 auto;
    max-width: 800px;
    border: 1px solid var(--subtle);
    padding: 0;
    border-radius: 10px;
    list-style:none;
  }
`;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  directoryPlugin
});
