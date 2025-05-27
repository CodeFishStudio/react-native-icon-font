import fs from 'fs';
import path from 'path';

/**
 * Filters and returns SVG file paths from a directory.
 */
export const getSvgFilesFromDirectory = (directory: string): string[] => {
    if (!fs.existsSync(directory)) {
        throw new Error(`Error! Folder does not exist: ${directory}`);
    }

    const files = fs.readdirSync(directory);

    const svgFilePaths = files
        .filter((file) => path.extname(file).toLowerCase() === '.svg')
        .map((file) => path.join(directory, file));

    if (svgFilePaths.length === 0) {
        throw new Error(`Error! No SVG files found in folder: ${directory}`);
    }

    return svgFilePaths;
};
