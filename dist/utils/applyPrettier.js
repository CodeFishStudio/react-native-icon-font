"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPrettier = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const prettier_1 = __importDefault(require("prettier"));
const applyPrettier = async (filePath) => {
    const config = await prettier_1.default.resolveConfig(filePath);
    const content = await promises_1.default.readFile(filePath, 'utf-8');
    const formatted = await prettier_1.default.format(content, {
        ...config,
        filepath: filePath, // ensures correct parser based on extension
    });
    await promises_1.default.writeFile(filePath, formatted, 'utf-8');
};
exports.applyPrettier = applyPrettier;
//# sourceMappingURL=applyPrettier.js.map