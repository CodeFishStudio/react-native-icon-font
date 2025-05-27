import { SVGIcons2SVGFontStreamOptions } from 'svgicons2svgfont';
type Params = {
    svgSource: string;
    fontName: string;
    fontOutput: string;
    startUnicode?: number;
    svgicons2svgfontOptions: Partial<SVGIcons2SVGFontStreamOptions>;
};
/**
 * Generates an SVG font from a directory of SVG icons.
 * @throws Error if the SVG font creation fails
 */
export declare function createSvgFont(params: Params): Promise<Record<string, string>>;
export {};
//# sourceMappingURL=createSvgFont.d.ts.map