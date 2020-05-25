import { NAMESPACES } from "./xmp";
/**
 * Extracts all markers from an XMP document.
 * @param xmp XMP document to parse.
 */
export function getCuePointMarkers(xmp) {
    var cuePointMarkers = xmp.findElements("//rdf:RDF/rdf:Description/xmpDM:Tracks/rdf:Bag/rdf:li/rdf:Description").iterateNext();
    if (cuePointMarkers === null)
        return null;
    // verify node is cuepoints
    var cuePointMarkersElem = cuePointMarkers;
    if (cuePointMarkersElem.getAttribute("xmpDM:trackType") !== "Cue")
        return null;
    // get framerate (frames per second)
    // e.g. xmpDM:frameRate="f48000"
    var frameRate = parseInt(cuePointMarkersElem.attributes.getNamedItemNS(NAMESPACES.xmpDM, "frameRate").value.substr(1));
    var markerNodes = xmp.findElements("//rdf:RDF/rdf:Description/xmpDM:Tracks/rdf:Bag/rdf:li/rdf:Description/xmpDM:markers/rdf:Seq//rdf:li/rdf:Description");
    var markers = [];
    var el = markerNodes.iterateNext();
    while (el) {
        var markerElement = el;
        // get marker startTime
        var markerStartTime = markerElement.attributes.getNamedItemNS(NAMESPACES.xmpDM, "startTime").value;
        var markerFrameRate = frameRate;
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
