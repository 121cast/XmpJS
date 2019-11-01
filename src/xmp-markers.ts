/// <reference path="xmp.ts" />

namespace XmpJS {
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
    export function getCuePointMarkers(xmp: XmpDocument): Array<IXmpMarker> {
        let cuePointMarkers: Node = xmp.findElements("//rdf:RDF/rdf:Description/xmpDM:Tracks/rdf:Bag/rdf:li/rdf:Description").iterateNext();

        if (cuePointMarkers === null)
            return null;

        // verify node is cuepoints
        let cuePointMarkersElem = cuePointMarkers as Element;
        if (cuePointMarkersElem.getAttribute("xmpDM:trackType") !== "Cue")
            return null;

        // get framerate (frames per second)
        // e.g. xmpDM:frameRate="f48000"
        let frameRate: number = parseInt(cuePointMarkersElem.attributes.getNamedItemNS(NAMESPACES.xmpDM, "frameRate").value.substr(1));

        let markerNodes: XPathResult = xmp.findElements("//rdf:RDF/rdf:Description/xmpDM:Tracks/rdf:Bag/rdf:li/rdf:Description/xmpDM:markers/rdf:Seq//rdf:li/rdf:Description");
        let markers: Array<IXmpMarker> = [];

        let el: Node = markerNodes.iterateNext();
        while (el) {
            let markerElement = el as Element;

            // get marker startTime
            let markerStartTime: string = markerElement.attributes.getNamedItemNS(NAMESPACES.xmpDM, "startTime").value;
            let markerFrameRate: number = frameRate;

            // marker startTime may contain a custom framerate, override the parent framerate
            // e.g. xmpDM:startTime="4801365"
            if (markerStartTime.indexOf('f') !== -1) {
                markerFrameRate = parseInt(markerStartTime.substr(markerStartTime.indexOf('f')).substr(1));
            }

            markers.push({
                name: markerElement.attributes.getNamedItemNS(NAMESPACES.xmpDM, "name").value,
                timestamp: parseInt(markerStartTime) / markerFrameRate * 1000
            });

            el = markerNodes.iterateNext();
        }

        return markers;
    }

}