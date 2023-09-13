import { readFile, readdir } from "node:fs/promises";
import ejs from "ejs";
import type { Plugin } from "vite";
import { Dirent } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

type IndexTemplateOptions = {
  rootName: string;
  hasParent: boolean;
  values: {
    name: string;
    url: string;
    isdir: number;
    size: number;
    size_string: string;
    date_modified: number;
    date_modified_string: string;
  }[];
};
const indexTemplate = ejs.compile(
  await readFile(
    new URL("../assets/index-template.ejs", import.meta.url),
    "utf-8",
  ),
) as unknown as (options: IndexTemplateOptions) => string;

interface DirectoryIndexOptions {}

function directoryIndex(options: DirectoryIndexOptions = {}): Plugin {
  const {} = options;

  // @ts-ignore
  let config: Parameters<Plugin["configResolved"]>[0];

  return {
    name: "directory-index",
    configResolved: (c) => void (config = c),
    configureServer(server) {
      if (config.mode !== "development") {
        return;
      }

      server.middlewares.use(async (req, res, next) => {
        if (res.headersSent) {
          return next();
        }

        const url = new URL(req.url, "http://localhost");

        const cwdURL = pathToFileURL(process.cwd());
        cwdURL.pathname += "/";

        const fileURL = new URL(url.pathname.slice(1), cwdURL);
        let files: Dirent[];
        try {
          files = await readdir(fileURL, { withFileTypes: true });
        } catch (error) {
          return next();
        }

        if (!url.pathname.endsWith("/")) {
          res.statusCode = 302;
          res.setHeader("Location", url.pathname + "/");
          res.end();
          return;
        }

        const html = indexTemplate({
          rootName: fileURLToPath(fileURL),
          hasParent: url.pathname !== "/",
          values: files.map((file) => ({
            name: file.name,
            url: file.name,
            isdir: file.isDirectory() ? 1 : 0,
            size: 0,
            size_string: "",
            date_modified: 0,
            date_modified_string: "",
          })),
        });

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(html);
      });
    },
  };
}

export default directoryIndex;
export type { DirectoryIndexOptions };
