"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFonts = void 0;
var xmp_1 = require("./xmp");
/**
 * Extracts all font definitions in an XMP document.
 * @param xmp XmpDocument to load fonts from.
 */
function getFonts(xmp) {
    var XPATH_EXPR = "//rdf:RDF/rdf:Description/xmpTPg:Fonts/rdf:Bag/rdf:li";
    return xmp_1.mapElements(xmp, XPATH_EXPR, function (node) {
        return null;
    });
}
exports.getFonts = getFonts;
