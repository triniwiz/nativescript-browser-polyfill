import Node from "./Node";
import { TNSCanvasRenderingContext2D, TNSCanvas } from "nativescript-canvas-plugin";

class Element extends Node {
    constructor( tagName ) {
        super( tagName.toUpperCase() );

        this.doc = {
            body: {
                innerHTML: "",
            },
        };
        this._classList = new Set();
        this._width = 0;
        this._height = 0;
    }

    get classList () {
        return this._classList;
    }

    get tagName () {
        return this.nodeName;
    }

    setAttribute () { }

    removeAttribute () {}

    setAttributeNS () { }

    removeAttributeNS () { }

    get clientWidth () {
        return this.innerWidth;
    }
    get clientHeight () {
        return this.innerHeight;
    }

    get offsetWidth () {
        return this.innerWidth;
    }
    get offsetHeight () {
        return this.innerHeight;
    }

    get innerWidth () {
        return this.width;
    }
    get innerHeight () {
        return this.height;
    }

    set width ( value ) {
        this._width = value;
        if ( this._canvas ) {
            this._canvas.width = value;
        }
    }

    get width () {
        if ( this._canvas ) {
           return this._canvas.width;
        }
        return this._width;
    }

    set height ( value ) {
        this._height = value;
        if ( this._canvas ) {
            this._canvas.height = value;
        }
    }

    get height () {
        if ( this._canvas ) {
           return this._canvas.height;
        }
        return this._height;
    }


    toDataURL ( type, encoderOptions ) {
        if ( !this._canvas ) {
            return "";
        }
        return this._canvas.toDataURL( type, encoderOptions );
    }


    getContext ( contextType, contextOptions, context ) {
       if(this._canvas){
           return this._canvas.getContext( contextType,  contextOptions);
       }else {
            if ( !this._canvas ) {
                this._canvas = TNSCanvas.createCustomView();
            }
            return this._canvas.getContext( contextType, contextOptions );
        }
    }

    get ontouchstart () {
        return {};
    }
}

export default Element;
