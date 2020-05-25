export declare const NAMESPACES: any;
/**
 * Exposes the known properties of an XMP document.
 */
export interface IXmpDocumentProperties {
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
export declare class XmpDocument {
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
export declare function loadXmpFromFile(file: File, callback: (xml: XmpDocument) => void): void;
export declare function getChildElement(parent: Node, name: string): Element;
export declare function mapElements<TResult>(xmp: XmpDocument, expression: string, mapping: (node: Node) => TResult): Array<TResult>;
