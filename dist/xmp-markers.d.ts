import { XmpDocument } from "./xmp";
/**
 * Defines a marker embedded within XMP.
 */
export interface IXmpMarker {
    /** Marker time in milliseconds */
    timestamp: number;
    /** Marker name */
    name: string;
}
/**
 * Extracts all markers from an XMP document.
 * @param xmp XMP document to parse.
 */
export declare function getCuePointMarkers(xmp: XmpDocument): Array<IXmpMarker>;
