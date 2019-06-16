declare namespace XmpJS {
    const NAMESPACES: any;
    /**
     * Exposes the known properties of an XMP document.
     */
    interface IXmpDocumentProperties {
        /** The document title. */
        title: string;
        /** The creator of this document. */
        creator: string;
        /** The date/time that this document was created. */
        created?: Date;
        /** The date/time that this document was modified. */
        modified?: Date;
        /** The number of pages in this document. */
        numPages?: number;
        hasVisibleOverprint?: boolean;
        hasVisibleTransparency?: boolean;
        creatorTool?: string;
        reditionClass?: string;
    }
    /**
     * Contains a single XMP document, wrapping the inner XML and providing
     * methods to query the inner data.
     */
    class XmpDocument {
        private _document;
        private _resolver;
        /**
         * Initializes a new XMP document object.
         * @param xml XML document to read from.
         */
        constructor(xml: Document);
        /**
         * Gets the inner XML document.
         */
        getDocument(): Document;
        /**
         * Gets the inner XML as a string.
         */
        getDocumentText(): string;
        /**
         * Gets the title of this document.
         */
        getTitle(): string;
        /**
         * Gets the creator of this document.
         */
        getCreator(): string;
        findElements(expression: string): XPathResult;
        getElementValue(expression: string): string;
    }
    /**
     * Extracts the XMP metadata from a file input.
     * @param file The read to read from.
     * @param callback The callback to run with the extracted XML document.
     */
    function loadXmpFromFile(file: File, callback: (xml: XmpDocument) => void): void;
    function getChildElement(parent: Node, name: string): Element;
    function mapElements<TResult>(xmp: XmpDocument, expression: string, mapping: (node: Node) => TResult): Array<TResult>;
}
declare namespace XmpJS {
    /**
     * Defines information about a font stored in XMP.
     */
    interface IXmpFontInfo {
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
    function getFonts(xmp: XmpDocument): Array<IXmpFontInfo>;
}
declare namespace XmpJS {
    interface IXmpID {
        prefix: string;
        id: string;
    }
}
declare namespace XmpJS {
    /**
     * Defines a marker embedded within XMP.
     */
    interface IXmpMarker {
        /** Marker time in milliseconds */
        timestamp: number;
        /** Marker name */
        name: string;
    }
    /**
     * Extracts all markers from an XMP document.
     * @param xmp XMP document to parse.
     */
    function getCuePointMarkers(xmp: XmpDocument): Array<IXmpMarker>;
}
declare namespace XmpJS {
    /**
     * Defines a thumbnail embedded within XMP.
     */
    interface IXmpThumbnail {
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
    function getThumbnails(xmp: XmpDocument): Array<IXmpThumbnail>;
    /**
     * Returns all thumbnails in the XMP as HTML-compatible image elements that
     * can be immediately inserted into the DOM. Widths and heights are automatically
     * set.
     * @param xmp XMP document to parse
     */
    function getThumbnailImages(xmp: XmpDocument): Array<HTMLImageElement>;
}
