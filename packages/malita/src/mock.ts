import { existsSync } from 'fs';
import path from 'path';
import type { Server } from 'http';
import { Plugin, build } from 'esbuild';
import glob from '../compiled/glob';
import type { AppData } from './appData';

function cleanRequireCache(absMockPath: string) {
    Object.keys(require.cache).forEach(file => {
        if (file.indexOf(absMockPath) > -1) {
            delete require.cache[file];
        }
    });
}

function normalizeConfig(config: any) {
    return Object.keys(config).reduce((memo: any, key) => {
        const handler = config[key];
        const type = typeof handler;
        if (type !== 'function' && type !== 'object') {
            return memo;
        }
        const req = key.split(' ');
        const method = req[0];
        const url = req[1];
        if (!memo[method]) memo[method] = {};
        memo[method][url] = handler;
        return memo;
    }, {});
}

export const getMockConfig = ({ appData, malitaServe }: { appData: AppData; malitaServe: Server; }) => {
    return new Promise(async (resolve: (value: any) => void, rejects) => {
        let config = {};
        const mockDir = path.resolve(appData.paths.cwd, 'mock');
        const mockFiles = glob.sync('**/*.ts', {
            cwd: mockDir,
        });
        const ret = mockFiles.map((memo) => {
            return path.join(mockDir, memo);
        });
        const mockOutDir = path.resolve(appData.paths.absTmpPath, 'mock');
        await build({
            format: 'cjs',
            logLevel: 'error',
            outdir: mockOutDir,
            bundle: true,
            watch: {
                onRebuild: (err, res) => {
                    if (err) {
                        console.error(JSON.stringify(err));
                        return;
                    }
                    malitaServe.emit('REBUILD', { appData });
                }
            },
            define: {
                'process.env.NODE_ENV': JSON.stringify('development'),
            },
            external: ['esbuild'],
            entryPoints: ret,
        });
        try {
            const outMockFiles = glob.sync('**/*.js', {
                cwd: mockOutDir,
            });
            cleanRequireCache(mockOutDir);
            config = outMockFiles.reduce((memo, mockFile) => {
                memo = {
                    ...memo,
                    ...require(path.resolve(mockOutDir, mockFile)).default,
                };
                return memo;
            }, {});
        } catch (error) {
            console.error('getMockConfig error', error);
            rejects(error);
        }
        resolve(normalizeConfig(config));
    })
}