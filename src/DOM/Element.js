import Node  from "./Node";
import TNSCanvasRenderingContext2D from "nativescript-canvas-plugin";

class Element extends Node {
    constructor(tagName) {
        super(tagName.toUpperCase());

        this.doc = {
            body: {
                innerHTML: "",
            },
        };
    }

    get tagName() {
        return this.nodeName;
    }

    setAttribute(){}

    removeAttribute(){}

    setAttributeNS() {}

    removeAttributeNS(){}

    get clientWidth() {
        return this.innerWidth;
    }
    get clientHeight() {
        return this.innerHeight;
    }

    get offsetWidth() {
        return this.innerWidth;
    }
    get offsetHeight() {
        return this.innerHeight;
    }

    get innerWidth() {
        return window.innerWidth;
    }
    get innerHeight() {
        return window.innerHeight;
    }

    getContext(contextType, contextOptions, context) {
        let possibleContext = context || global.__context;
        if (contextType !== "2d" && possibleContext && possibleContext.type !== '2d') {
            if(possibleContext.type === '2d'){
          //    possibleContext = possibleContext.canvas.getContext('webgl');
          //return null;
             }
            return possibleContext;
        }
        if (contextType === "2d" && possibleContext && possibleContext.type === '2d') {
            if(possibleContext.type !== '2d'){
             //  possibleContext = possibleContext.canvas.getContext('2d');
            // return null;
            }
            return possibleContext;
        }

        return {
            fillText: (text, x, y, maxWidth) => ({}),
            measureText: (text) => ({
                width: (text || "").split("").length * 6,
                height: 24,
            }),
            fillRect: () => ({}),
            drawImage: () => ({}),
            getImageData: () => ({
                data: new Uint8ClampedArray([255, 0, 0, 0]),
            }),
            getContextAttributes: () => ({
                stencil: true,
            }),
            getExtension: () => ({
                loseContext: () => {},
            }),
            putImageData: () => ({}),
            createImageData: () => ({}),
        };
    }

    get ontouchstart() {
        return {};
    }
}

export default Element;
