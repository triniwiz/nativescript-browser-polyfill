import Document from "./DOM/Document";
import "./performance";
import HTMLImageElement from "./DOM/HTMLImageElement";
import HTMLCanvasElement from "./DOM/HTMLCanvasElement";
import HTMLVideoElement from "./DOM/HTMLVideoElement";
import { fromObject } from "tns-core-modules/data/observable";
import { device } from "tns-core-modules/platform";
import { TNSCanvasRenderingContext2D as CanvasRenderingContext2D , TNSWebGLRenderingContext as WebGLRenderingContext} from "nativescript-canvas-plugin";
global.CANVAS_RENDERER = "false";
global.WEBGL_RENDERER = "true";
global.window = global.window || {
    console: console,
    WEBGL_RENDERER: "true",
    CANVAS_RENDERER: "false"
};

global.window.HTMLImageElement = global.HTMLImageElement =
    global.HTMLImageElement || HTMLImageElement;
global.window.Image = global.Image =
    global.Image || HTMLImageElement;
global.window.ImageBitmap = global.ImageBitmap =
    global.ImageBitmap || HTMLImageElement;
global.window.HTMLVideoElement = global.HTMLVideoElement =
    global.HTMLVideoElement || HTMLVideoElement;
global.window.Video = global.Video =
    global.Video || HTMLVideoElement;
global.window.HTMLCanvasElement = global.HTMLCanvasElement =
    global.HTMLCanvasElement || HTMLCanvasElement;
global.window.Canvas = global.Canvas =
    global.Canvas || HTMLCanvasElement;
global.window.CanvasRenderingContext2D = global.CanvasRenderingContext2D =
    global.CanvasRenderingContext2D || CanvasRenderingContext2D;
global.window.WebGLRenderingContext = global.WebGLRenderingContext =
    global.WebGLRenderingContext || WebGLRenderingContext;

function checkEmitter() {
    if (
        !global.emitter ||
        !(
            global.emitter.on ||
            global.emitter.addEventListener ||
            global.emitter.addListener
        )
    ) {
        global.window.emitter = global.emitter = fromObject(
            {}
        );
    }
}

global.window.scrollTo = global.scrollTo =
    global.scrollTo || (() => ({}));

global.window.addEventListener = global.addEventListener = (
    eventName,
    listener
) => {
    checkEmitter();
    const addListener = () => {
        if (global.emitter.on) {
            global.emitter.on(eventName, listener);
        } else if (global.emitter.addEventListener) {
            global.emitter.addEventListener(eventName, listener);
        } else if (global.emitter.addListener) {
            global.emitter.addListener(eventName, listener);
        }
    };

    addListener();

    if (eventName.toLowerCase() === "load") {
        if (global.emitter && global.emitter.emit) {
            setTimeout(() => {
                global.emitter.emit("load");
            }, 1);
        }
    }
};

global.window.removeEventListener = global.removeEventListener = (
    eventName,
    listener
) => {
    checkEmitter();
    if (global.emitter.off) {
        global.emitter.off(eventName, listener);
    } else if (global.emitter.removeEventListener) {
        global.emitter.removeEventListener(eventName, listener);
    } else if (global.emitter.removeListener) {
        global.emitter.removeListener(eventName, listener);
    }
};

//window.DOMParser = window.DOMParser || require('xmldom-qsa').DOMParser;

const agent = "chrome";
global.window.navigator = global.navigator =
    global.navigator || {};
global.window.userAgent = global.userAgent =
    global.userAgent || agent;
global.window.navigator.userAgent = global.navigator.userAgent =
    global.navigator.userAgent || agent;
global.window.navigator.product = global.navigator.product =
    "NativeScript";
global.window.navigator.platform = global.navigator.platform =
    global.navigator.platform || [];
global.window.navigator.appVersion = global.navigator.appVersion =
    global.navigator.appVersion || device.osVersion;
global.window.navigator.maxTouchPoints = global.navigator.maxTouchPoints =
    global.navigator.maxTouchPoints || 5;
global.window.navigator.standalone = global.navigator.standalone =
    global.navigator.standalone === null
        ? true
        : global.navigator.standalone;

global.window["chrome"] = global["chrome"] = global[
    "chrome"
] || {
    extension: {},
};
///https://www.w3schools.com/js/js_window_location.asp
global.window.location = global.location = global
    .location || {
    href: "", //  window.location.href returns the href (URL) of the current page
    hostname: "", //window.location.hostname returns the domain name of the web host
    pathname: "", //window.location.pathname returns the path and filename of the current page
    protocol: "https", //window.location.protocol returns the web protocol used (http: or https:)
    assign: null, //window.location.assign loads a new document
};

if (global.document) {
    global.window.document = global.document.readyState =
        "complete";
}

global.window.setTimeout = setTimeout;
global.window.setInterval = setInterval;
