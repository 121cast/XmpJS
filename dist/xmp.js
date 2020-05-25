export var NAMESPACES = {
    dc: "http://purl.org/dc/elements/1.1/",
    illustrator: "http://ns.adobe.com/illustrator/1.0/",
    pdf: "http://ns.adobe.com/pdf/1.3/",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    stDim: "http://ns.adobe.com/xap/1.0/sType/Dimensions#",
    stEvt: "http://ns.adobe.com/xap/1.0/sType/ResourceEvent#",
    stFnt: "http://ns.adobe.com/xap/1.0/sType/Font#",
    stRef: "http://ns.adobe.com/xap/1.0/sType/ResourceRef#",
    xmp: "http://ns.adobe.com/xap/1.0/",
    xmpG: "http://ns.adobe.com/xap/1.0/g/",
    xmpGImg: "http://ns.adobe.com/xap/1.0/g/img/",
    xmpMM: "http://ns.adobe.com/xap/1.0/mm/",
    xmpTPg: "http://ns.adobe.com/xap/1.0/t/pg/",
    xmpDM: "http://ns.adobe.com/xmp/1.0/DynamicMedia/",
};
/**
 * Contains a single XMP document, wrapping the inner XML and providing
 * methods to query the inner data.
 */
var XmpDocument = /** @class */ (function () {
    /**
     * Initializes a new XMP document object.
     * @param xml XML document to read from.
     */
    function XmpDocument(xml) {
        this._document = xml;
        /*
        * It should be possible to use the document itself to build this list,
        * which would be far better for extensibility; however, this doesn't
        * seem to work, so I've falled back to using a manual dictionary; this
        * just has to contain all possible prefixes and namespaces until we
        * can find a better solution!
        */
        this._resolver = function (prefix) {
            return NAMESPACES[prefix] || "";
        };
    }
    /**
     * Gets the inner XML document.
     */
    XmpDocument.prototype.getDocument = function () {
        return this._document;
    };
    /**
     * Gets the inner XML as a string.
     */
    XmpDocument.prototype.getDocumentText = function () {
        return this._document.documentElement.outerHTML;
    };
    /**
     * Gets the title of this document.
     */
    XmpDocument.prototype.getTitle = function () {
        return this.getElementValue("//rdf:RDF/rdf:Description/dc:title/rdf:Alt/rdf:li");
    };
    /**
     * Gets the creator of this document.
     */
    XmpDocument.prototype.getCreator = function () {
        return this.getElementValue("//rdf:RDF/rdf:Description/dc:creator/rdf:Alt/rdf:li");
    };
    XmpDocument.prototype.findElements = function (expression) {
        return this._document.evaluate(expression, this._document, this._resolver, XPathResult.ANY_TYPE, null);
    };
    XmpDocument.prototype.getElementValue = function (expression) {
        var e = this.findElements(expression).iterateNext();
        return e ? e.textContent : "";
    };
    return XmpDocument;
}());
export { XmpDocument };
/**
 * Extracts the XMP metadata from a file input.
 * @param file The read to read from.
 * @param callback The callback to run with the extracted XML document.
 */
export function loadXmpFromFile(file, callback) {
    var XMP_START = "<x:xmpmeta", XMP_END = "</x:xmpmeta>", DOC_TYPE = "text/xml", reader = new FileReader();
    reader.onload = function (e) {
        // load the XMP by sub-stringing the stringified binary data; seems
        // clunky but is actually quite fast in most browsers; cleverer people
        // might be able to do this using an ArrayBuffer for greater efficiency
        var str = e.target.result, doc = null;
        // work out where the XML data sits within the file
        var startPos = str.indexOf(XMP_START), endPos = str.indexOf(XMP_END, startPos);
        if (startPos && endPos) {
            var parser = new DOMParser(), xml = str.substr(startPos, (endPos + 12) - startPos);
            doc = parser.parseFromString(xml, DOC_TYPE);
        }
        callback(new XmpDocument(doc));
    };
    reader.readAsText(file);
}
export function getChildElement(parent, name) {
    var child;
    for (var i = 0; i < parent.childNodes.length; i++) {
        child = parent.childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE && child.localName === name) {
            return child;
        }
    }
    return null;
}
export function mapElements(xmp, expression, mapping) {
    var results = [], xpath = xmp.findElements(expression), node = xpath.iterateNext();
    while (node) {
        results.push(mapping(node));
        node = xpath.iterateNext();
    }
    return results;
}
