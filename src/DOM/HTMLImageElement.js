import Element from "./Element";
import { isIOS } from "@nativescript/core/platform";
import * as fs from "tns-core-modules/file-system";
import { TNSImageAsset } from 'nativescript-canvas-plugin';
const b64Extensions = {
    "/": "jpg",
    i: "png",
    R: "gif",
    U: "webp",
};

function b64WithoutPrefix(b64) {
    return b64.split(",")[1];
}

function getMIMEforBase64String(b64) {
    let input = b64;
    if (b64.includes(",")) {
        input = b64WithoutPrefix(b64);
    }
    const first = input.charAt(0);
    const mime = b64Extensions[first];
    if (!mime) {
        throw new Error("Unknown Base64 MIME type: " + b64);
    }
    return mime;
}

function getUUID() {
    if (isIOS) {
        return NSUUID.UUID().UUIDString;
    }
    return java.util.UUID.randomUUID().toString();
}

class HTMLImageElement extends Element {
    get src() {
        return this.localUri;
    }

    set src(value) {
        this.localUri = value;
        this._load();
    }

    get onload() {
        return this._onload;
    }
    set onload(value) {
        this._onload = value;
    }

    get complete() {
        return this._complete;
    }
    set complete(value) {
        this._complete = value;
        if (value) {
            this.emitter.emit("load", this);
            this.onload();
        }
    }
    set width(value){
        this._width = value;
    }

    get width(){
        return this._width;
    }

    set height(value){
        this._height = value;
    }

    get height(){
        return this._height;
    }
    constructor(props) {
        super("img");
        //this._load = this._load.bind(this);
        this._onload = () => {};
        if (props !== null && typeof props === "object") {
            this.src = props.localUri;
            this.width = props.width;
            this.height = props.height;
            this._load();
        }
    }

    _load() {
        if (this.src) {
            if (
                typeof this.src === "string" &&
                this.src.startsWith &&
                this.src.startsWith("data:")
            ) {
                // is base64 - convert and try again;
                this._base64 = this.src;
                const base64result = this.src.split(",")[1];
                if(!base64result){
                    return;
                }
                (async () => {
                    try {
                        const MIME = getMIMEforBase64String(base64result);
                        this.localUri = fs.path.join(
                            fs.knownFolders.documents().path,
                            `${getUUID()}-b64image.${MIME}`
                        );
                        const file = fs.File.fromPath(this.localUri);
                        let toWrite;
                        if (isIOS) {
                            toWrite = NSData.alloc().initWithBase64EncodedStringOptions(
                                base64result,
                                0
                            );
                        } else {
                            toWrite = android.util.Base64.decode(
                                base64result,
                                android.util.Base64.DEFAULT
                            );
                        }
                        await file.write(toWrite);
                        this._load();
                    } catch (error) {
                        if (global.__debug_browser_polyfill_image) {
                            console.log(
                                `nativescript-browser-polyfill: Error:`,
                                error.message
                            );
                        }
                        this.emitter.emit("error", { target: this, error });
                    }
                })();
                return;
            }
            if (!this.width || !this.height) {
                this.complete = false;
                this._asset = new TNSImageAsset();
                this._asset.loadFileAsync(this.src)
                .then(() => {
                    this.width = this._asset.width;
                    this.height = this._asset.height;
                    this.complete = true;
                })
                .catch(e => {
                    this.emitter.emit("error", { target: this });
                });
            } else {
                this._asset = new TNSImageAsset();
                this._asset.loadFileAsync(this.src)
                .then(()=>{
                    this.width = this._asset.width;
                    this.height = this._asset.height;
                    this.complete = true;
                })
                .catch(e =>{
                    this.emitter.emit("error", { target: this });
                });
            }
        }
    }
}

export default HTMLImageElement;
