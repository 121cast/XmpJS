import { NAMESPACES, getChildElement } from "./xmp";
/**
 * Extracts all thumbnails from an XMP document.
 * @param xmp XMP document to parse.
 */
export function getThumbnails(xmp) {
    var results = xmp.findElements("//rdf:RDF/rdf:Description/xmp:Thumbnails/rdf:Alt/rdf:li");
    var thumbnails = [];
    var el = results.iterateNext();
    while (el) {
        if (el.hasChildNodes()) {
            var imageEl = getChildElement(el, "image");
            if (imageEl) {
                thumbnails.push({
                    image: imageEl.textContent,
                    format: getChildElement(el, "format").textContent,
                    width: parseInt(getChildElement(el, "width").textContent, 10),
                    height: parseInt(getChildElement(el, "height").textContent, 10)
                });
            }
        }
        else {
            var imageAttr = el.attributes.getNamedItemNS(NAMESPACES.xmpGImg, "image");
            if (imageAttr) {
                var format = el.attributes.getNamedItemNS(NAMESPACES.xmpGImg, "format");
                var width = el.attributes.getNamedItemNS(NAMESPACES.xmpGImg, "width");
                var height = el.attributes.getNamedItemNS(NAMESPACES.xmpGImg, "height");
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
/**
 * Returns all thumbnails in the XMP as HTML-compatible image elements that
 * can be immediately inserted into the DOM. Widths and heights are automatically
 * set.
 * @param xmp XMP document to parse
 */
export function getThumbnailImages(xmp) {
    return getThumbnails(xmp).map(function (value) {
        console.log("Rendering image element for thumbnail");
        var img = new Image(value.width, value.height);
        img.src = "data:image/" + value.format.toLowerCase() + ";base64," + value.image;
        return img;
    });
}
