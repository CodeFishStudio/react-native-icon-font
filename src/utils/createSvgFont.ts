import fixPathDirections from 'fix-path-directions';
import fs, { ReadStream } from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { SVGIcons2SVGFontStream, SVGIcons2SVGFontStreamOptions } from 'svgicons2svgfont';

import { getSvgFilesFromDirectory } from './getSvgFilesFromDirectory';

const { getFixedPathDataString } = fixPathDirections;

type Params = {
    svgSource: string;
    fontName: string;
    fontOutput: string;
    startUnicode?: number;
    svgicons2svgfontOptions: Partial<SVGIcons2SVGFontStreamOptions>;
};

/**
 * Uses the 'fix-path-directions' library to auto-fix the path directions of the
 * SVG icons so that they conform to the non-zero fill rule. Exporting to
 * TrueType fonts only supports the non-zero fill rule, and any subtracting
 * paths relying on a even-odd fill rule will subtract from their enclosing
 * path.
 */
const fixSvgPathDirections = (svgContent: string) => {
    // Match all path elements and their 'd' attributes
    return svgContent.replace(/<path[^>]*d="([^"]*)"[^>]*>/g, (match, d) => {
        const processedD = getFixedPathDataString(d);

        // Reconstruct the path element with the processed 'd' value
        return match.replace(/d="[^"]*"/, `d="${processedD}"`);
    });
};

/**
 * Generates an SVG font from a directory of SVG icons.
 * @throws Error if the SVG font creation fails
 */
export async function createSvgFont(params: Params): Promise<Record<string, string>> {
    const {
        svgSource,
        fontName,
        fontOutput,
        startUnicode: providedStartUnicode = 0xea01,
        svgicons2svgfontOptions,
    } = params;

    const unicodeMap: Record<string, string> = {};
    let currentUnicode = providedStartUnicode;

    return new Promise((resolve, reject) => {
        try {
            const destinationPath = path.join(fontOutput, `${fontName}.svg`);

            const fontStream = new SVGIcons2SVGFontStream({
                ...svgicons2svgfontOptions,
                fontName,
            });

            fontStream
                .pipe(fs.createWriteStream(destinationPath))
                .on('finish', () => {
                    resolve(unicodeMap);
                })
                .on('error', (error) => {
                    reject(error);
                });

            const svgFilePaths = getSvgFilesFromDirectory(svgSource);

            for (const filePath of svgFilePaths) {
                const iconName = path.basename(filePath, '.svg');

                // Read and modify SVG content
                const svgContent = fs.readFileSync(filePath, 'utf-8');
                const modifiedSvg = fixSvgPathDirections(svgContent);

                // Create a new stream from the modified content
                const glyph = new Readable({
                    read() {
                        this.push(modifiedSvg);
                        this.push(null); // Signal end of stream
                    },
                }) as ReadStream & {
                    metadata: { unicode: string[]; name: string };
                };

                const currentUnicodeString = String.fromCharCode(currentUnicode++);
                unicodeMap[iconName] = currentUnicodeString;

                glyph.metadata = { unicode: [currentUnicodeString], name: iconName };
                fontStream.write(glyph);
            }

            fontStream.end();
        } catch (error) {
            reject(
                new Error(
                    `Failed to create SVG font: ${error instanceof Error ? error.message : String(error)}`,
                ),
            );
        }
    });
}
