"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSvgFilesFromDirectory = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Filters and returns SVG file paths from a directory.
 */
const getSvgFilesFromDirectory = (directory) => {
    if (!fs_1.default.existsSync(directory)) {
        throw new Error(`Error! Folder does not exist: ${directory}`);
    }
    const files = fs_1.default.readdirSync(directory);
    const svgFilePaths = files
        .filter((file) => path_1.default.extname(file).toLowerCase() === '.svg')
        .map((file) => path_1.default.join(directory, file));
    if (svgFilePaths.length === 0) {
        throw new Error(`Error! No SVG files found in folder: ${directory}`);
    }
    return svgFilePaths;
};
exports.getSvgFilesFromDirectory = getSvgFilesFromDirectory;
//# sourceMappingURL=getSvgFilesFromDirectory.js.map