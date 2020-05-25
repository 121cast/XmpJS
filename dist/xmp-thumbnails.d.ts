import { XmpDocument } from "./xmp";
/**
 * Defines a thumbnail embedded within XMP.
 */
export interface IXmpThumbnail {
    /** Image width in pixels */
    width: number;
    /** Image height in pixels */
    height: number;
    /** Image format */
    format: string;
    /** Base-64 encoded image data */
    image: string;
}
/**
 * Extracts all thumbnails from an XMP document.
 * @param xmp XMP document to parse.
 */
export declare function getThumbnails(xmp: XmpDocument): Array<IXmpThumbnail>;
/**
 * Returns all thumbnails in the XMP as HTML-compatible image elements that
 * can be immediately inserted into the DOM. Widths and heights are automatically
 * set.
 * @param xmp XMP document to parse
 */
export declare function getThumbnailImages(xmp: XmpDocument): Array<HTMLImageElement>;
