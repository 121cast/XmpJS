import { XmpDocument } from "./xmp";
export interface IXmpFontInfo {
    /** The font family. */
    family: string;
    /** The font face. */
    face: string;
    /** The font type. */
    type?: string;
    /** The font name. */
    name: string;
    /** The font version. */
    version?: string;
    /** The filename of the font. */
    fileName?: string;
}
/**
 * Extracts all font definitions in an XMP document.
 * @param xmp XmpDocument to load fonts from.
 */
export declare function getFonts(xmp: XmpDocument): Array<IXmpFontInfo>;
