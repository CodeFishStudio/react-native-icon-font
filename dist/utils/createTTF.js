"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTTF = createTTF;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const svg2ttf_1 = __importDefault(require("svg2ttf"));
const ansiCodes_1 = require("./ansiCodes");
/**
 * Converts an SVG font to a TTF font.
 * @throws Error if the SVG font file cannot be read or TTF cannot be written
 */
async function createTTF(params) {
    const { fontName, fontOutput } = params;
    const svgFontPath = path_1.default.join(fontOutput, `${fontName}.svg`);
    const ttfFontPath = path_1.default.join(fontOutput, `${fontName}.ttf`);
    try {
        const svgFontContent = await fs_1.default.promises.readFile(svgFontPath, 'utf8');
        const ttf = (0, svg2ttf_1.default)(svgFontContent, {});
        const ttfBuffer = Buffer.from(ttf.buffer);
        await fs_1.default.promises.writeFile(ttfFontPath, ttfBuffer);
        console.log(`${ansiCodes_1.AnsiCodes.Bold}${ansiCodes_1.AnsiCodes.Blue}TTF font ${ansiCodes_1.AnsiCodes.Green}created → ${ansiCodes_1.AnsiCodes.Reset}${ansiCodes_1.AnsiCodes.Underline}${ttfFontPath}${ansiCodes_1.AnsiCodes.Reset}`);
        return ttfBuffer;
    }
    catch (error) {
        throw new Error(`Failed to create TTF font: ${error instanceof Error ? error.message : String(error)}`);
    }
}
//# sourceMappingURL=createTTF.js.map