export declare class TNSXMLHttpRequestUpload {
    private _request;
    private _listeners;
    constructor(req: any);
    addEventListener(eventName: string, handler: (e: any) => void): void;
    removeEventListener(eventName: string, toDetach: (e: any) => void): void;
    _emitEvent(eventName: string, ...args: Array<any>): void;
}
export declare class TNSXMLHttpRequest {
    UNSENT: number;
    OPENED: number;
    HEADERS_RECEIVED: number;
    LOADING: number;
    DONE: number;
    onreadystatechange: (...args: any[]) => void;
    ontimeout: (...args: any[]) => void;
    onabort: (...args: any[]) => void;
    onerror: (...args: any[]) => void;
    onload: (...args: any[]) => void;
    onloadend: (...args: any[]) => void;
    onloadstart: (...args: any[]) => void;
    onprogress: (...args: any[]) => void;
    timeout: number;
    private _readyState;
    private _response;
    private _responseType;
    private _responseText;
    private _status;
    private _request;
    private _http;
    private _currentRequest;
    private _lastProgress;
    private _headers;
    private _responseURL;
    private _httpContent;
    private _upload;
    private _listeners;
    withCredentials: boolean;
    constructor();
    readonly readyState: number;
    readonly response: any;
    responseType: any;
    readonly responseText: any;
    readonly responseURL: string;
    readonly status: number;
    readonly statusText: string;
    readonly upload: any;
    private textTypes;
    readonly responseXML: any;
    private isTextContentType;
    private _setResponseType;
    getAllResponseHeaders(): string;
    getResponseHeader(header: string): string;
    overrideMimeType(mime: string): void;
    private _addToStringOnResponse;
    private _toJSString;
    open(method: string, url: string, async?: boolean, username?: string | null, password?: string | null): void;
    setRequestHeader(header: string, value: any): void;
    send(body?: any): void;
    abort(): void;
    addEventListener(eventName: string, handler: (e: any) => void): void;
    removeEventListener(eventName: string, toDetach: (e: any) => void): void;
    private emitEvent;
    dispatchEvent(event: Event): boolean;
    private _updateReadyStateChange;
}
export declare class FormData {
    private _data;
    constructor();
    append(name: string, value: any): void;
    toString(): string;
}
export declare class Blob {
    static InternalAccessor: {
        new (): {};
        getBuffer(blob: Blob): Uint8Array;
    };
    private _buffer;
    private _size;
    private _type;
    readonly size: number;
    readonly type: string;
    constructor(chunks?: Array<BufferSource | DataView | Blob | string>, opts?: {
        type?: string;
    });
    arrayBuffer(): Promise<ArrayBuffer>;
    text(): Promise<string>;
    slice(start?: number, end?: number, type?: string): Blob;
    stream(): void;
    toString(): string;
    [Symbol.toStringTag]: string;
}
export declare class File extends Blob {
    private _name;
    private _lastModified;
    readonly name: string;
    readonly lastModified: number;
    constructor(chunks: Array<BufferSource | DataView | Blob | string>, name: string, opts?: {
        type?: string;
        lastModified?: number;
    });
    toString(): string;
    [Symbol.toStringTag]: string;
}
export declare class FileReader {
    EMPTY: number;
    LOADING: number;
    DONE: number;
    onabort: (...args: any[]) => void;
    onerror: (...args: any[]) => void;
    onload: (...args: any[]) => void;
    onloadend: (...args: any[]) => void;
    onloadstart: (...args: any[]) => void;
    onprogress: (...args: any[]) => void;
    private _readyState;
    private _result;
    private _listeners;
    readonly readyState: number;
    readonly result: string | ArrayBuffer | null;
    constructor();
    private _array2base64;
    private _read;
    private emitEvent;
    addEventListener(eventName: string, handler: Function): void;
    removeEventListener(eventName: string, toDetach: Function): void;
    readAsDataURL(blob: Blob): void;
    readAsText(blob: Blob): void;
    readAsArrayBuffer(blob: Blob): void;
    abort(): void;
    toString(): string;
    [Symbol.toStringTag]: string;
}
