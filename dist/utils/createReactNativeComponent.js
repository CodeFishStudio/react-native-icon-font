"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReactNativeComponent = createReactNativeComponent;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const ansiCodes_1 = require("./ansiCodes");
const applyPrettier_1 = require("./applyPrettier");
const getSvgFilesFromDirectory_1 = require("./getSvgFilesFromDirectory");
const reactNativeSource_1 = require("./reactNativeSource");
const reactNativeTypeSource_1 = require("./reactNativeTypeSource");
async function createReactNativeComponent(params) {
    const { fontName, componentName, iconSize = 16, unicodeObject, componentOutput, svgSource, } = params;
    const files = (0, getSvgFilesFromDirectory_1.getSvgFilesFromDirectory)(svgSource);
    const iconMap = new Map();
    files.map((filepath) => {
        const baseFileName = path_1.default.basename(filepath, '.svg');
        const unicode = unicodeObject[baseFileName];
        if (!unicode) {
            throw new Error(`Unicode not found for icon: ${baseFileName}`);
        }
        iconMap.set(baseFileName, unicode);
    });
    const outputDirectory = path_1.default.resolve(process.cwd(), componentOutput);
    const componentFilename = `${componentName}.tsx`;
    const componentTypesFilename = `types.ts`;
    // Ensure output directory exists
    await promises_1.default.mkdir(outputDirectory, { recursive: true });
    const componentPath = path_1.default.join(outputDirectory, componentFilename);
    const typesPath = path_1.default.join(outputDirectory, componentTypesFilename);
    await promises_1.default.writeFile(componentPath, (0, reactNativeSource_1.reactNativeSource)({
        componentName,
        fontName,
        iconSize,
        iconMap,
    }), 'utf-8');
    await promises_1.default.writeFile(typesPath, (0, reactNativeTypeSource_1.reactNativeTypeSource)({ componentName }), 'utf-8');
    // Run Prettier on component files
    await (0, applyPrettier_1.applyPrettier)(componentPath);
    await (0, applyPrettier_1.applyPrettier)(typesPath);
    console.log(`${ansiCodes_1.AnsiCodes.Bold}${ansiCodes_1.AnsiCodes.Blue}React Native Component ${ansiCodes_1.AnsiCodes.Green}created → ${ansiCodes_1.AnsiCodes.Reset}${ansiCodes_1.AnsiCodes.Underline}${componentOutput}/${componentFilename}${ansiCodes_1.AnsiCodes.Reset}`);
}
//# sourceMappingURL=createReactNativeComponent.js.map