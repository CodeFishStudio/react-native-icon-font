import fs from 'fs/promises';
import prettier from 'prettier';

export const applyPrettier = async (filePath: string) => {
    const config = await prettier.resolveConfig(filePath);
    const content = await fs.readFile(filePath, 'utf-8');
    const formatted = await prettier.format(content, {
        ...config,
        filepath: filePath, // ensures correct parser based on extension
    });
    await fs.writeFile(filePath, formatted, 'utf-8');
};
