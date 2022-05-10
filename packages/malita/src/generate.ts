import { lodash, generateFile, prompts } from '@umijs/utils';
import path from 'path';
import fs from 'fs';

export const generate = async (args: string[]) => {
    const [type, name] = args;
    const absSrcPath = path.resolve(process.cwd(), 'src');
    const absPagesPath = path.resolve(absSrcPath, 'pages');
    const questions = [
        {
            name: 'hi',
            type: 'text',
            message: `What's your name?`,
        }
    ] as prompts.PromptObject[];
    if (fs.existsSync(absPagesPath) && type && name) {
        generateFile({
            path: path.join(__dirname, `../templates/${type}`),
            target: path.join(absPagesPath, name),
            data: {
                name: lodash.upperFirst(name),
            },
            questions
        });
    }
}