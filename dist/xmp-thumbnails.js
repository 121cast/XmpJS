"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThumbnailImages = exports.getThumbnails = void 0;
var xmp_1 = require("./xmp");
/**
 * Extracts all thumbnails from an XMP document.
 * @param xmp XMP document to parse.
 */
function getThumbnails(xmp) {
    var results = xmp.findElements("//rdf:RDF/rdf:Description/xmp:Thumbnails/rdf:Alt/rdf:li");
    var thumbnails = [];
    var el = results.iterateNext();
    while (el) {
        if (el.hasChildNodes()) {
            var imageEl = xmp_1.getChildElement(el, "image");
            if (imageEl) {
                thumbnails.push({
                    image: imageEl.textContent,
                    format: xmp_1.getChildElement(el, "format").textContent,
                    width: parseInt(xmp_1.getChildElement(el, "width").textContent, 10),
                    height: parseInt(xmp_1.getChildElement(el, "height").textContent, 10)
                });
            }
        }
        else {
            var imageAttr = el.attributes.getNamedItemNS(xmp_1.NAMESPACES.xmpGImg, "image");
            if (imageAttr) {
                var format = el.attributes.getNamedItemNS(xmp_1.NAMESPACES.xmpGImg, "format");
                var width = el.attributes.getNamedItemNS(xmp_1.NAMESPACES.xmpGImg, "width");
                var height = el.attributes.getNamedItemNS(xmp_1.NAMESPACES.xmpGImg, "height");
                thumbnails.push({
                    image: imageAttr.value,
                    format: format.value,
                    width: parseInt(width.value, 10),
                    height: parseInt(height.value, 10)
                });
            }
        }
        el = results.iterateNext();
    }
    return thumbnails;
}
exports.getThumbnails = getThumbnails;
/**
 * Returns all thumbnails in the XMP as HTML-compatible image elements that
 * can be immediately inserted into the DOM. Widths and heights are automatically
 * set.
 * @param xmp XMP document to parse
 */
function getThumbnailImages(xmp) {
    return getThumbnails(xmp).map(function (value) {
        console.log("Rendering image element for thumbnail");
        var img = new Image(value.width, value.height);
        img.src = "data:image/" + value.format.toLowerCase() + ";base64," + value.image;
        return img;
    });
}
exports.getThumbnailImages = getThumbnailImages;
