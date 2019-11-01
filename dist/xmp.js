var XmpJS;
(function (XmpJS) {
    XmpJS.NAMESPACES = {
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
                return XmpJS.NAMESPACES[prefix] || "";
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
    XmpJS.XmpDocument = XmpDocument;
    /**
     * Extracts the XMP metadata from a file input.
     * @param file The read to read from.
     * @param callback The callback to run with the extracted XML document.
     */
    function loadXmpFromFile(file, callback) {
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
    XmpJS.loadXmpFromFile = loadXmpFromFile;
    function getChildElement(parent, name) {
        var child;
        for (var i = 0; i < parent.childNodes.length; i++) {
            child = parent.childNodes[i];
            if (child.nodeType === Node.ELEMENT_NODE && child.localName === name) {
                return child;
            }
        }
        return null;
    }
    XmpJS.getChildElement = getChildElement;
    function mapElements(xmp, expression, mapping) {
        var results = [], xpath = xmp.findElements(expression), node = xpath.iterateNext();
        while (node) {
            results.push(mapping(node));
            node = xpath.iterateNext();
        }
        return results;
    }
    XmpJS.mapElements = mapElements;
})(XmpJS || (XmpJS = {}));
/// <reference path="xmp.ts" />
/// <reference path="xmp.ts" />
/// <reference path="xmp.ts" />
var XmpJS;
(function (XmpJS) {
    /**
     * Extracts all font definitions in an XMP document.
     * @param xmp XmpDocument to load fonts from.
     */
    function getFonts(xmp) {
        var XPATH_EXPR = "//rdf:RDF/rdf:Description/xmpTPg:Fonts/rdf:Bag/rdf:li";
        return XmpJS.mapElements(xmp, XPATH_EXPR, function (node) {
            return null;
        });
    }
    XmpJS.getFonts = getFonts;
})(XmpJS || (XmpJS = {}));
/// <reference path="xmp.ts" />
/// <reference path="xmp.ts" />
/// <reference path="xmp.ts" />
var XmpJS;
(function (XmpJS) {
    /**
     * Extracts all markers from an XMP document.
     * @param xmp XMP document to parse.
     */
    function getCuePointMarkers(xmp) {
        var cuePointMarkers = xmp.findElements("//rdf:RDF/rdf:Description/xmpDM:Tracks/rdf:Bag/rdf:li/rdf:Description").iterateNext();
        if (cuePointMarkers === null)
            return null;
        // verify node is cuepoints
        var cuePointMarkersElem = cuePointMarkers;
        if (cuePointMarkersElem.getAttribute("xmpDM:trackType") !== "Cue")
            return null;
        // get framerate (frames per second)
        // e.g. xmpDM:frameRate="f48000"
        var frameRate = parseInt(cuePointMarkersElem.attributes.getNamedItemNS(XmpJS.NAMESPACES.xmpDM, "frameRate").value.substr(1));
        var markerNodes = xmp.findElements("//rdf:RDF/rdf:Description/xmpDM:Tracks/rdf:Bag/rdf:li/rdf:Description/xmpDM:markers/rdf:Seq//rdf:li/rdf:Description");
        var markers = [];
        var el = markerNodes.iterateNext();
        while (el) {
            var markerElement = el;
            // get marker startTime
            var markerStartTime = markerElement.attributes.getNamedItemNS(XmpJS.NAMESPACES.xmpDM, "startTime").value;
            var markerFrameRate = frameRate;
            // marker startTime may contain a custom framerate, override the parent framerate
            // e.g. xmpDM:startTime="4801365"
            if (markerStartTime.indexOf('f') !== -1) {
                markerFrameRate = parseInt(markerStartTime.substr(markerStartTime.indexOf('f')).substr(1));
            }
            markers.push({
                name: markerElement.attributes.getNamedItemNS(XmpJS.NAMESPACES.xmpDM, "name").value,
                timestamp: parseInt(markerStartTime) / markerFrameRate * 1000
            });
            el = markerNodes.iterateNext();
        }
        return markers;
    }
    XmpJS.getCuePointMarkers = getCuePointMarkers;
})(XmpJS || (XmpJS = {}));
/// <reference path="xmp.ts" />
var XmpJS;
(function (XmpJS) {
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
                var imageEl = XmpJS.getChildElement(el, "image");
                if (imageEl) {
                    thumbnails.push({
                        image: imageEl.textContent,
                        format: XmpJS.getChildElement(el, "format").textContent,
                        width: parseInt(XmpJS.getChildElement(el, "width").textContent, 10),
                        height: parseInt(XmpJS.getChildElement(el, "height").textContent, 10)
                    });
                }
            }
            else {
                var imageAttr = el.attributes.getNamedItemNS(XmpJS.NAMESPACES.xmpGImg, "image");
                if (imageAttr) {
                    var format = el.attributes.getNamedItemNS(XmpJS.NAMESPACES.xmpGImg, "format");
                    var width = el.attributes.getNamedItemNS(XmpJS.NAMESPACES.xmpGImg, "width");
                    var height = el.attributes.getNamedItemNS(XmpJS.NAMESPACES.xmpGImg, "height");
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
    XmpJS.getThumbnails = getThumbnails;
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
    XmpJS.getThumbnailImages = getThumbnailImages;
})(XmpJS || (XmpJS = {}));
