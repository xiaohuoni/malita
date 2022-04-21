import esbuild, {
    Plugin,
} from 'esbuild';

// https://github.com/evanw/esbuild/issues/20#issuecomment-802269745
export function style(): Plugin {
    return {
        name: 'style',
        setup({ onResolve, onLoad }) {
            onResolve({ filter: /\.css$/, namespace: 'file' }, (args) => {
                return { path: args.path, namespace: 'style-stub' };
            });
            onResolve({ filter: /\.css$/, namespace: 'style-stub' }, (args) => {
                return { path: args.path, namespace: 'style-content' };
            });
            onResolve(
                { filter: /^__style_helper__$/, namespace: 'style-stub' },
                (args) => ({
                    path: args.path,
                    namespace: 'style-helper',
                    sideEffects: false,
                }),
            );

            onLoad({ filter: /.*/, namespace: 'style-helper' }, async () => ({
                contents: `
              export function injectStyle(text) {
                if (typeof document !== 'undefined') {
                  var style = document.createElement('style')
                  var node = document.createTextNode(text)
                  style.appendChild(node)
                  document.head.appendChild(style)
                }
              }
            `,
            }));

            onLoad({ filter: /.*/, namespace: 'style-stub' }, async (args) => ({
                contents: `
              import { injectStyle } from "__style_helper__"
              import css from ${JSON.stringify(args.path)}
              injectStyle(css)
            `,
            }));

            onLoad(
                {
                    filter: /.*/,
                    namespace: 'style-content',
                },
                async (args) => {
                    const { errors, warnings, outputFiles } = await esbuild.build(
                        {
                            entryPoints: [args.path],
                            logLevel: 'silent',
                            bundle: true,
                            write: false,
                            charset: 'utf8',
                            minify: true,
                            loader: {
                                '.svg': 'dataurl',
                                '.ttf': 'dataurl',
                            },
                        }
                    );
                    return {
                        errors,
                        warnings,
                        contents: outputFiles![0].text,
                        loader: 'text',
                    };
                },
            );
        },
    };
}
