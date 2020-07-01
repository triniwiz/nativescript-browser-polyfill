import Element from "./Element";
import HTMLVideoElement from "./HTMLVideoElement";
import HTMLImageElement from "./HTMLImageElement";
import HTMLCanvasElement from "./HTMLCanvasElement";
import Text from "./Text";
import { TNSCanvas } from "nativescript-canvas-plugin";
import { Frame } from '@nativescript/core/ui/frame';
class Document extends Element {
    constructor() {
        super("#document");
        this.body = new Element("BODY");
        this.documentElement = new Element("HTML");
        this.readyState = "complete";
        this.head = new Element("HEAD");
        this.defaultView = global.window;
    }

    createElement(tagName) {
        switch ((tagName || "").toLowerCase()) {
            case "video":
                return new HTMLVideoElement(tagName);
            case "img":
                return new HTMLImageElement(tagName);
            case "canvas":
                const canvas = new HTMLCanvasElement(tagName);
                canvas._canvas = TNSCanvas.createCustomView();
                return canvas;
            case "iframe":
                // Return nothing to keep firebase working.
                return null;
            default:
                return new Element(tagName);
        }
    }

    createElementNS(...args) {
        var name;
        var namespaceURI;
        if (Array.isArray(args) && args.length === 1) {
            name = args[0];
        } else if (Array.isArray(args) && args.length > 1) {
            name = args[1];
            namespaceURI = args[0];
        } else {
            name = args;
        }
        const element = this.createElement(name);
        element.namespaceURI = namespaceURI;
        element.toDataURL = () => ({});
        return element;
    }

    createTextNode(data) {
        return new Text(data);
    }

    getElementById(id) {
        const topmost = Frame.topmost();
        if (topmost) {
            const nativeElement = topmost.getViewById(id);
            if (nativeElement) {
                const element = new Element("div");
                element.nativeElement = nativeElement;
                return element;
            }
        }
        return new Element("div");
    }
}

export default Document;
