import { existsSync } from 'fs';
import path from 'path';
import { build } from 'esbuild';
import type { AppData } from './appData';
import { DEFAULT_CONFIG_FILE } from './constants';

export interface UserConfig {
    title?: string;
    keepalive?: any[];
}
export const getUserConfig = ({ appData, sendMessage }: { appData: AppData; sendMessage: (type: string, data?: any) => void; }) => {
    return new Promise(async (resolve: (value: UserConfig) => void, rejects) => {
        let config = {};
        const configFile = path.resolve(appData.paths.cwd, DEFAULT_CONFIG_FILE);

        if (existsSync(configFile)) {
            await build({
                format: 'cjs',
                logLevel: 'error',
                outdir: appData.paths.absOutputPath,
                bundle: true,
                watch: {
                    onRebuild: (err, res) => {
                        if (err) {
                            console.error(JSON.stringify(err));
                            return;
                        }
                        sendMessage?.('reload');
                    }
                },
                define: {
                    'process.env.NODE_ENV': JSON.stringify('development'),
                },
                external: ['esbuild'],
                entryPoints: [configFile],
            });
            try {
                config = require(path.resolve(appData.paths.absOutputPath, 'malita.config.js')).default;
            } catch (error) {
                console.error('getUserConfig error', error);
                rejects(error);
            }
        }
        resolve(config);
    })
}