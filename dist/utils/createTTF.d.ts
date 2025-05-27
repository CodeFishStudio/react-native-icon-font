type Params = {
    fontName: string;
    fontOutput: string;
};
/**
 * Converts an SVG font to a TTF font.
 * @throws Error if the SVG font file cannot be read or TTF cannot be written
 */
export declare function createTTF(params: Params): Promise<Buffer>;
export {};
//# sourceMappingURL=createTTF.d.ts.map