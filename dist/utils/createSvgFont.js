"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSvgFont = createSvgFont;
const fix_path_directions_1 = __importDefault(require("fix-path-directions"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const stream_1 = require("stream");
const svgicons2svgfont_1 = require("svgicons2svgfont");
const getSvgFilesFromDirectory_1 = require("./getSvgFilesFromDirectory");
const { getFixedPathDataString } = fix_path_directions_1.default;
/**
 * Uses the 'fix-path-directions' library to auto-fix the path directions of the
 * SVG icons so that they conform to the non-zero fill rule. Exporting to
 * TrueType fonts only supports the non-zero fill rule, and any subtracting
 * paths relying on a even-odd fill rule will subtract from their enclosing
 * path.
 */
const fixSvgPathDirections = (svgContent) => {
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
async function createSvgFont(params) {
    const { svgSource, fontName, fontOutput, startUnicode: providedStartUnicode = 0xea01, svgicons2svgfontOptions, } = params;
    const unicodeMap = {};
    let currentUnicode = providedStartUnicode;
    return new Promise((resolve, reject) => {
        try {
            const destinationPath = path_1.default.join(fontOutput, `${fontName}.svg`);
            const fontStream = new svgicons2svgfont_1.SVGIcons2SVGFontStream({
                ...svgicons2svgfontOptions,
                fontName,
            });
            fontStream
                .pipe(fs_1.default.createWriteStream(destinationPath))
                .on('finish', () => {
                resolve(unicodeMap);
            })
                .on('error', (error) => {
                reject(error);
            });
            const svgFilePaths = (0, getSvgFilesFromDirectory_1.getSvgFilesFromDirectory)(svgSource);
            for (const filePath of svgFilePaths) {
                const iconName = path_1.default.basename(filePath, '.svg');
                // Read and modify SVG content
                const svgContent = fs_1.default.readFileSync(filePath, 'utf-8');
                const modifiedSvg = fixSvgPathDirections(svgContent);
                // Create a new stream from the modified content
                const glyph = new stream_1.Readable({
                    read() {
                        this.push(modifiedSvg);
                        this.push(null); // Signal end of stream
                    },
                });
                const currentUnicodeString = String.fromCharCode(currentUnicode++);
                unicodeMap[iconName] = currentUnicodeString;
                glyph.metadata = { unicode: [currentUnicodeString], name: iconName };
                fontStream.write(glyph);
            }
            fontStream.end();
        }
        catch (error) {
            reject(new Error(`Failed to create SVG font: ${error instanceof Error ? error.message : String(error)}`));
        }
    });
}
//# sourceMappingURL=createSvgFont.js.map