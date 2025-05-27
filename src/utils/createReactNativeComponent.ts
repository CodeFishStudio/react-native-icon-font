import fs from 'fs/promises';
import path from 'path';

import { AnsiCodes } from './ansiCodes';
import { applyPrettier } from './applyPrettier';
import { getSvgFilesFromDirectory } from './getSvgFilesFromDirectory';
import { reactNativeSource } from './reactNativeSource';
import { reactNativeTypeSource } from './reactNativeTypeSource';

export async function createReactNativeComponent(params: {
    svgSource: string;
    unicodeObject: Record<string, string>;
    componentOutput: string;
    fontName: string;
    componentName: string;
    iconSize: number;
}) {
    const {
        fontName,
        componentName,
        iconSize = 16,
        unicodeObject,
        componentOutput,
        svgSource,
    } = params;

    const files = getSvgFilesFromDirectory(svgSource);

    const iconMap = new Map<string, string>();
    files.map((filepath) => {
        const baseFileName = path.basename(filepath, '.svg');
        const unicode = unicodeObject[baseFileName];
        if (!unicode) {
            throw new Error(`Unicode not found for icon: ${baseFileName}`);
        }
        iconMap.set(baseFileName, unicode);
    });

    const outputDirectory = path.resolve(process.cwd(), componentOutput);
    const componentFilename = `${componentName}.tsx`;
    const componentTypesFilename = `types.ts`;

    // Ensure output directory exists
    await fs.mkdir(outputDirectory, { recursive: true });

    const componentPath = path.join(outputDirectory, componentFilename);
    const typesPath = path.join(outputDirectory, componentTypesFilename);

    await fs.writeFile(
        componentPath,
        reactNativeSource({
            componentName,
            fontName,
            iconSize,
            iconMap,
        }),
        'utf-8',
    );
    await fs.writeFile(typesPath, reactNativeTypeSource({ componentName }), 'utf-8');

    // Run Prettier on component files
    await applyPrettier(componentPath);
    await applyPrettier(typesPath);

    console.log(
        `${AnsiCodes.Bold}${AnsiCodes.Blue}React Native Component ${AnsiCodes.Green}created → ${AnsiCodes.Reset}${AnsiCodes.Underline}${componentOutput}/${componentFilename}${AnsiCodes.Reset}`,
    );
}
