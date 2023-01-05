import { ViteDevServer, PluginOption, Plugin } from 'vite';
import { dirname, basename, join} from 'path';
import { readdir, access, writeFile } from 'fs/promises'
import { Dirent } from 'fs';
import { getIconForFile, getSVGStringFromFileType,getIconForFolder } from '@wesbos/code-icons';

type ViteContextDocs = {
  path: string
  filename: string
  server?: ViteDevServer
  bundle?: import('rollup').OutputBundle
  chunk?: import('rollup').OutputChunk
}

type ViteContext = ViteContextDocs & {
  originalUrl?: string
}

function makeListFromDirectory(directoryListing: Dirent[], base: string, filters: string[]) {
  // 3. Generate a listing of links
  const links = directoryListing
    // .sort((a, b) => a.isDirectory() ? 1 : -1)
    .reduce((acc, file: Dirent) => {
      if(file.isDirectory()) {
        acc[0].push(file)
      } else {
        acc[1].push(file)
      }
      return acc;
    }, [[], []] as [Dirent[], Dirent[]])
    .flat()
    .filter(dirent => !filters.includes(dirent.name))
    .map(file => {
      const icon = file.isDirectory() ? getIconForFolder(file.name) : getIconForFile(file.name);
      const { svg } = getSVGStringFromFileType(icon);
      return `<li>
        <a data-filename="${file.name}" href="${base === '/' ? '' : base}/${file.name === 'index.html' ? '.' : file.name}">
          ${svg}
          ${file.name}
        </a>
        </li>`;
    }).join('');

    return links;
}

const fallbackHTML = /*html*/`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Vite Dev Server</title>
    <link rel="icon" href="https://fav.farm/🔥" />
  </head>
  <body>
    <!--
      This file was Generated for you by the vite-plugin-list-directory-contents plugin.
      You can edit anything in here. Just leave the DIRECTORY tag where you want the directory listing to go.

      ❤️ @wesbos
    -->
    {%DIRECTORY%}
  </body>
</html>`;


type PluginArgs = {
  baseDir: string
  filterList?: string[]
}

export function directoryPlugin({ baseDir, filterList }: PluginArgs): PluginOption {
  if(!filterList) {
    filterList = ['.DS_Store', 'package.json', 'package-lock.json', 'node_modules', '.parcelrc', '.parcel-cache', 'dist', 'packages', '.git', '.eslintrc', '.gitignore', '.npmrc', 'tsconfig.json', 'vite.config.ts', 'vite.config.js', '.env', 'development.env', 'production.env', '.vite'];
  }

  const plugin: Plugin = {
    name: 'vite-plugin-list-directory-contents',
    // only apply during dev
    apply: 'serve',
    handleHotUpdate({ server, file }) {
      const folder = dirname(file.replace(baseDir, ''));
      const filename = basename(file);
      server.ws.send('vite:directoryChanged', { baseDir, folder, filename });
    },
    async configureServer(server) {
      // return a post hook that is called after internal middlewares are
      // installed
      // Check if they have an index.html in their baseDir wit node.js
      const indexPath = join(baseDir, 'index.html');
      let indexExists = false;
      try {
        await access(indexPath);
        indexExists = true;
      } catch (err) {
        setTimeout(() => {
          console.log('\x1b[33m%s\x1b[0m', `⚡️ [vite-plugin-list-directory-contents]: No index.html found in baseDir.
⚡️ Don't worry! We will now make you one for you at
⚡️ ${indexPath}
`);
        }, 1000); // add a delay because Vite clears the console
        // create index.html file
        await writeFile(indexPath, fallbackHTML);
      }
    },
    async transformIndexHtml(html: string, ctx: ViteContextDocs) {
      // the Vite plugin types dont include context.originalUrl so some reason so I'm casting
      const context = ctx as ViteContext;
      // vite falls back to index.html if no other file matches
      if (!ctx.filename.endsWith('index.html')) return html;
      const currentFolder = join(baseDir, context.originalUrl.replace('/index.html', ''));
      // watch current Dir - this is so Vite will watch the files on our directory listing
      context.server.watcher.unwatch(currentFolder);
      context.server.watcher.add(currentFolder);

      // 2.  Get a listing of files in the directory
      const directoryListing: Dirent[] = await readdir(currentFolder, { withFileTypes: true });
      const fileArray = directoryListing.map(dirent => dirent.name);

      const listItems = makeListFromDirectory(directoryListing, context.originalUrl, filterList);

      const folder = context.originalUrl;
      return html.replace(
        '{%DIRECTORY%}',
        /*html*/`<h2>Index Of ${context.originalUrl}</h2>
        <ul>
          ${context.originalUrl === '/' ? '' : '<li><a href="..">⬆️ Up a level</a></li>'}
          ${listItems.length ? listItems : '<li><a href=".">👻 It\'s very quiet in here. Make a file or two and get coding!</a><li>'}
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
        </script>
        <!-- 🥰 Generated by a Vite Plugin, Made by Wes Bos for Tasty TypeScript-->
        `
      )
    },
  }
  return plugin;
}

const css = /*css*/`
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
    font-family: 'Operator Mono', 'Dank Mono', 'Fira Code', 'Consolas', monospace;
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
