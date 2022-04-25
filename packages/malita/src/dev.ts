import express from 'express';
import { build } from 'esbuild';
import path from "path";
import fs from "fs";
import portfinder from 'portfinder';
import { createServer } from 'http';
import { DEFAULT_CONFIG_FILE, DEFAULT_OUTDIR, DEFAULT_PLATFORM, DEFAULT_PORT, DEFAULT_HOST, DEFAULT_BUILD_PORT } from './constants';
import { createWebSocketServer } from './server';
import { style } from './styles';
import { getAppData } from './appData';
import { getUserConfig } from './config';
import { getRoutes } from './routes';
import { generateEntry } from './entry';
import { generateHtml } from './html';

export const dev = async () => {
    const cwd = process.cwd();
    const app = express();
    const port = await portfinder.getPortPromise({
        port: DEFAULT_PORT,
    });

    const output = path.resolve(cwd, DEFAULT_OUTDIR);

    app.get('/', (_req, res, next) => {
        res.set('Content-Type', 'text/html');
        const htmlPath = path.join(output, 'index.html');
        if (fs.existsSync(htmlPath)) {
            fs.createReadStream(htmlPath).on('error', next).pipe(res);
        } else {
            next();
        }
    });

    app.use(`/${DEFAULT_OUTDIR}`, express.static(output));
    app.use(`/malita`, express.static(path.resolve(__dirname, 'client')));

    const malitaServe = createServer(app);
    const ws = createWebSocketServer(malitaServe);

    function sendMessage(type: string, data?: any) {
        console.log(type)
        ws.send(JSON.stringify({ type, data }));
    }

    malitaServe.listen(port, async () => {
        console.log(`App listening at http://${DEFAULT_HOST}:${port}`);
        try {
            // 生命周期

            // 获取项目元信息 
            const appData = await getAppData({
                cwd
            });
            // 获取用户数据
            const userConfig = await getUserConfig({
                appData, sendMessage
            });
            // 获取 routes 配置
            const routes = await getRoutes({ appData });
            // 生成项目主入口
            await generateEntry({ appData, routes, userConfig });
            // 生成 Html
            await generateHtml({ appData, userConfig });
            // 执行构建
            await build({
                format: 'iife',
                logLevel: 'error',
                outdir: appData.paths.absOutputPath,
                platform: DEFAULT_PLATFORM,
                bundle: true,
                watch: {
                    onRebuild: (err, res) => {
                        if (err) {
                            console.error(JSON.stringify(err));
                            return;
                        }
                        sendMessage('reload')
                    }
                },
                define: {
                    'process.env.NODE_ENV': JSON.stringify('development'),
                },
                external: ['esbuild'],
                plugins: [style()],
                entryPoints: [appData.paths.absEntryPath],
            });
            // [Issues](https://github.com/evanw/esbuild/issues/805)
            // 查了很多资料，esbuild serve 不能响应 onRebuild， esbuild build 和 express 组合不能不写入文件
        } catch (e) {
            console.log(e);
            process.exit(1);
        }
    });





}