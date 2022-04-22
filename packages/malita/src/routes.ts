import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import path from 'path';
import type { AppData } from './appData';
import { DEFAULT_GLOBAL_LAYOUTS, DEFAULT_OUTDIR, DEFAULT_PLATFORM, DEFAULT_PORT, DEFAULT_HOST, DEFAULT_BUILD_PORT } from './constants';

const getFiles = (root: string) => {
    if (!existsSync(root)) return [];
    return readdirSync(root).filter((file) => {
        const absFile = path.join(root, file);
        const fileStat = statSync(absFile);
        const isFile = fileStat.isFile();
        if (isFile) {
            if (!/\.tsx?$/.test(file)) return false;
        }
        return true;
    });;
}

const filesToRoutes = (files: string[], pagesPath: string): IRoute[] => {
    return files.map(i => {
        let pagePath = path.basename(i, path.extname(i));
        const element = path.resolve(pagesPath, pagePath);
        if (pagePath === 'home') pagePath = '';
        return {
            path: `/${pagePath}`,
            element,
        }
    });
}

export interface IRoute {
    element: any;
    path: string;
    routes?: IRoute[];
}

export const getRoutes = ({ appData }: { appData: AppData }) => {
    return new Promise((resolve: (value: IRoute[]) => void) => {
        const files = getFiles(appData.paths.absPagesPath);
        const routes = filesToRoutes(files, appData.paths.absPagesPath);
        const layoutPath = path.resolve(appData.paths.absSrcPath, DEFAULT_GLOBAL_LAYOUTS);
        if (!existsSync(layoutPath)) {
            resolve(routes);
        } else {
            resolve([{
                path: '/',
                element: layoutPath.replace(path.extname(layoutPath), ''),
                routes: routes
            }]);
        }
    })
}