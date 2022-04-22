import { mkdir, writeFileSync } from 'fs';
import path from 'path';
import type { AppData } from './appData';
import { DEFAULT_FRAMEWORK_NAME, DEFAULT_OUTDIR } from './constants';

export const generateHtml = ({ appData }: { appData: AppData; }) => {
    return new Promise((resolve, rejects) => {
        const content = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <title>${appData.pkg.name ?? 'Malita'}</title>
        </head>
        
        <body>
            <div id="malita">
                <span>loading...</span>
            </div>
            <script src="/${DEFAULT_OUTDIR}/${DEFAULT_FRAMEWORK_NAME}.js"></script>
            <script src="/malita/client.js"></script>
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