"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileIconFont = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const createReactNativeComponent_1 = require("./utils/createReactNativeComponent");
const createSvgFont_1 = require("./utils/createSvgFont");
const createTTF_1 = require("./utils/createTTF");
const compileIconFont = async (options) => {
    const { svgSource, fontOutput, componentOutput, fontName, componentName, iconSize } = options;
    try {
        const fontOutputDirectory = node_path_1.default.resolve(process.cwd(), fontOutput);
        // Ensures the font output directory exists
        await promises_1.default.mkdir(fontOutputDirectory, { recursive: true });
        // Create SVG font (to be deleted later)
        const unicodeObject = await (0, createSvgFont_1.createSvgFont)({
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
        await (0, createTTF_1.createTTF)({ fontName, fontOutput });
        // Generate React Native components
        await (0, createReactNativeComponent_1.createReactNativeComponent)({
            fontName,
            componentName,
            iconSize,
            svgSource,
            unicodeObject,
            componentOutput,
        });
        // Remove generated SVG font (used by `createTTF`)
        const svgPath = node_path_1.default.join(fontOutputDirectory, `${fontName}.svg`);
        await promises_1.default.rm(svgPath);
    }
    catch (error) {
        console.error('Error generating icons');
        console.error(error);
    }
};
exports.compileIconFont = compileIconFont;
//# sourceMappingURL=compileIconFont.js.map