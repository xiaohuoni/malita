import { mkdir, writeFileSync } from 'fs';
import path from 'path';
import type { AppData } from './appData';
import { DEFAULT_FRAMEWORK_NAME, DEFAULT_OUTDIR } from './constants';
import type { UserConfig } from './config';

export const generateHtml = ({ appData, userConfig, isProduction = false }: { appData: AppData; userConfig: UserConfig; isProduction?: boolean; }) => {
    return new Promise((resolve, rejects) => {
        const title = userConfig?.title ?? appData.pkg.name ?? 'Malita';
        const content = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
        </head>
        
        <body>
            <div id="malita">
                <span>loading...</span>
            </div>
            <script src="${isProduction ? '.' : `/${DEFAULT_OUTDIR}`}/${DEFAULT_FRAMEWORK_NAME}.js"></script>
            ${isProduction ? '' : '<script src="/malita/client.js"></script>'}
        </body>
        </html>`;
        try {
            const htmlPath = path.resolve(appData.paths.absOutputPath, 'index.html')
            mkdir(path.dirname(htmlPath), { recursive: true }, (err) => {
                if (err) {
                    rejects(err)
                }
                writeFileSync(htmlPath, content, 'utf-8');
                resolve({})
            });
        } catch (error) {
            rejects({})
        }
    })
}