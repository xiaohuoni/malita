import minimist from 'minimist';
import fs from 'fs-extra';
import path from 'path';
import resolve from 'resolve';
// @ts-ignore
import ncc from '@vercel/ncc';
import { Package } from 'dts-packer';

const argv = minimist(process.argv.slice(2));
const cwd = process.cwd();
const nodeModulesPath = path.join(cwd, 'node_modules');
const pkg = argv._[0];
const entry = require.resolve(pkg, {
    paths: [nodeModulesPath],
});
const target = `compiled/${pkg}`;

const build = async () => {
    const { code } = await ncc(entry, {
        minify: true,
        target: 'es5',
        assetBuilds: false,
    })
    fs.ensureDirSync(target);
    fs.writeFileSync(path.join(target, 'index.js'), code, 'utf-8');
    const pkgRoot = path.dirname(
        resolve.sync(`${pkg}/package.json`, {
            basedir: cwd,
        }),
    );
    if (fs.existsSync(path.join(pkgRoot, 'LICENSE'))) {
        fs.copyFileSync(path.join(pkgRoot, 'LICENSE'), path.join(target, 'LICENSE'))
    }
    fs.copyFileSync(path.join(pkgRoot, 'package.json'), path.join(target, 'package.json'))
    new Package({
        cwd: cwd,
        name: pkg,
        typesRoot: target,
    });
}

build();
