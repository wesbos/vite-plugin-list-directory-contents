import * as rollup from 'rollup';
import { ViteDevServer } from 'vite';

declare type ViteContext = {
    path: string;
    filename: string;
    originalUrl?: string;
    server?: ViteDevServer;
    bundle?: rollup.OutputBundle;
    chunk?: rollup.OutputChunk;
};
declare type PluginArgs = {
    baseDir: string;
    filterList?: string[];
};
declare function htmlPlugin({ baseDir, filterList }: PluginArgs): {
    name: string;
    transformIndexHtml(html: string, ctx: ViteContext): Promise<string>;
};

export { htmlPlugin };
