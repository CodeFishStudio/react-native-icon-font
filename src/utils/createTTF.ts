import fs from 'fs';
import path from 'path';
import svg2ttf from 'svg2ttf';

import { AnsiCodes } from './ansiCodes';

type Params = {
    fontName: string;
    fontOutput: string;
};

/**
 * Converts an SVG font to a TTF font.
 * @throws Error if the SVG font file cannot be read or TTF cannot be written
 */
export async function createTTF(params: Params): Promise<Buffer> {
    const { fontName, fontOutput } = params;
    const svgFontPath = path.join(fontOutput, `${fontName}.svg`);
    const ttfFontPath = path.join(fontOutput, `${fontName}.ttf`);

    try {
        const svgFontContent = await fs.promises.readFile(svgFontPath, 'utf8');
        const ttf = svg2ttf(svgFontContent, {});
        const ttfBuffer = Buffer.from(ttf.buffer);

        await fs.promises.writeFile(ttfFontPath, ttfBuffer);
        console.log(
            `${AnsiCodes.Bold}${AnsiCodes.Blue}TTF font ${AnsiCodes.Green}created → ${AnsiCodes.Reset}${AnsiCodes.Underline}${ttfFontPath}${AnsiCodes.Reset}`,
        );

        return ttfBuffer;
    } catch (error) {
        throw new Error(
            `Failed to create TTF font: ${error instanceof Error ? error.message : String(error)}`,
        );
    }
}
