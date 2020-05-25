import { mapElements } from "./xmp";
/**
 * Extracts all font definitions in an XMP document.
 * @param xmp XmpDocument to load fonts from.
 */
export function getFonts(xmp) {
    var XPATH_EXPR = "//rdf:RDF/rdf:Description/xmpTPg:Fonts/rdf:Bag/rdf:li";
    return mapElements(xmp, XPATH_EXPR, function (node) {
        return null;
    });
}
