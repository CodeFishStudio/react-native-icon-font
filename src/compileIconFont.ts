import fs from 'fs/promises';
import path from 'node:path';

import { CompileIconFontOptions } from './types';
import { createReactNativeComponent } from './utils/createReactNativeComponent';
import { createSvgFont } from './utils/createSvgFont';
import { createTTF } from './utils/createTTF';

export const compileIconFont = async (options: CompileIconFontOptions) => {
    const { svgSource, fontOutput, componentOutput, fontName, componentName, iconSize } = options;

    try {
        const fontOutputDirectory = path.resolve(process.cwd(), fontOutput);

        // Ensures the font output directory exists
        await fs.mkdir(fontOutputDirectory, { recursive: true });

        // Create SVG font (to be deleted later)
        const unicodeObject = await createSvgFont({
            svgSource,
            fontName,
            fontOutput,
            svgicons2svgfontOptions: {
                /**
                 * Lucide Icons says that 'At least 1000 is recommended'
                 * https://github.com/lucide-icons/lucide/blob/main/tools/build-font/main.mjs
                 *
                 * Whatever the default value
                 */
                fontHeight: 1000,
                normalize: false, // just included to mimic Lucide Icons
            },
        });

        // Create TTF font
        await createTTF({ fontName, fontOutput });

        // Generate React Native components
        await createReactNativeComponent({
            fontName,
            componentName,
            iconSize,
            svgSource,
            unicodeObject,
            componentOutput,
        });

        // Remove generated SVG font (used by `createTTF`)
        const svgPath = path.join(fontOutputDirectory, `${fontName}.svg`);
        await fs.rm(svgPath);
    } catch (error) {
        console.error('Error generating icons');
        console.error(error);
    }
};
