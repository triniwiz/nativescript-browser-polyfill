"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../http/http");
var http_request_common_1 = require("../http/http-request-common");
var platform_1 = require("@nativescript/core/platform");
var types = require("@nativescript/core/utils/types");
var file_1 = require("../file/file");
var fs = require("@nativescript/core/file-system");
var XMLHttpRequestResponseType;
(function (XMLHttpRequestResponseType) {
    XMLHttpRequestResponseType["empty"] = "";
    XMLHttpRequestResponseType["text"] = "text";
    XMLHttpRequestResponseType["json"] = "json";
    XMLHttpRequestResponseType["document"] = "document";
    XMLHttpRequestResponseType["arraybuffer"] = "arraybuffer";
    XMLHttpRequestResponseType["blob"] = "blob";
})(XMLHttpRequestResponseType || (XMLHttpRequestResponseType = {}));
var statuses = {
    100: 'Continue',
    101: 'Switching Protocols',
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non - Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request - URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported'
};
var Status;
(function (Status) {
    Status[Status["UNSENT"] = 0] = "UNSENT";
    Status[Status["OPENED"] = 0] = "OPENED";
    Status[Status["LOADING"] = 200] = "LOADING";
    Status[Status["DONE"] = 200] = "DONE";
})(Status || (Status = {}));
var TNSXMLHttpRequestUpload = (function () {
    function TNSXMLHttpRequestUpload(req) {
        this._listeners = new Map();
        this._request = req;
    }
    TNSXMLHttpRequestUpload.prototype.addEventListener = function (eventName, handler) {
        var handlers = this._listeners.get(eventName) || [];
        handlers.push(handler);
        this._listeners.set(eventName, handlers);
    };
    TNSXMLHttpRequestUpload.prototype.removeEventListener = function (eventName, toDetach) {
        var handlers = this._listeners.get(eventName) || [];
        handlers = handlers.filter(function (handler) { return handler !== toDetach; });
        this._listeners.set(eventName, handlers);
    };
    TNSXMLHttpRequestUpload.prototype._emitEvent = function (eventName) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var handlers = this._listeners.get(eventName) || [];
        handlers.forEach(function (handler) {
            handler.apply.apply(handler, [_this].concat(args));
        });
    };
    return TNSXMLHttpRequestUpload;
}());
exports.TNSXMLHttpRequestUpload = TNSXMLHttpRequestUpload;
var TNSXMLHttpRequest = (function () {
    function TNSXMLHttpRequest() {
        this.UNSENT = 0;
        this.OPENED = 1;
        this.HEADERS_RECEIVED = 2;
        this.LOADING = 3;
        this.DONE = 4;
        this.timeout = 0;
        this._readyState = this.UNSENT;
        this._response = '';
        this._responseType = null;
        this._responseText = null;
        this._request = null;
        this._lastProgress = { lengthComputable: false, loaded: 0, total: 0, target: this };
        this._responseURL = '';
        this._listeners = new Map();
        this.textTypes = [
            'text/plain',
            'application/xml',
            'application/rss+xml',
            'text/html',
            'text/xml',
        ];
        this._status = Status.UNSENT;
        this._http = new http_1.Http();
        this._upload = new TNSXMLHttpRequestUpload(this);
    }
    Object.defineProperty(TNSXMLHttpRequest.prototype, "readyState", {
        get: function () {
            return this._readyState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNSXMLHttpRequest.prototype, "response", {
        get: function () {
            return this._response;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNSXMLHttpRequest.prototype, "responseType", {
        get: function () {
            return this._responseType;
        },
        set: function (value) {
            if (value === XMLHttpRequestResponseType.empty ||
                value in XMLHttpRequestResponseType) {
                this._responseType = value;
            }
            else {
                throw new Error("Response type of '" + value + "' not supported.");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNSXMLHttpRequest.prototype, "responseText", {
        get: function () {
            if (this._responseType === XMLHttpRequestResponseType.text ||
                this._responseType === XMLHttpRequestResponseType.json) {
                return this._responseText;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNSXMLHttpRequest.prototype, "responseURL", {
        get: function () {
            return this._responseURL;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNSXMLHttpRequest.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNSXMLHttpRequest.prototype, "statusText", {
        get: function () {
            if (this._readyState === this.UNSENT ||
                this._readyState === this.OPENED) {
                return '';
            }
            return statuses[this.status];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNSXMLHttpRequest.prototype, "upload", {
        get: function () {
            return this._upload;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNSXMLHttpRequest.prototype, "responseXML", {
        get: function () {
            var header = this.getResponseHeader('Content-Type') ||
                this.getResponseHeader('content-type');
            var contentType = header && header.toLowerCase();
            if (this.isTextContentType(contentType)) {
                if (this._responseType === XMLHttpRequestResponseType.document) {
                    return this.responseText;
                }
            }
            return '';
        },
        enumerable: true,
        configurable: true
    });
    TNSXMLHttpRequest.prototype.isTextContentType = function (contentType) {
        var result = false;
        for (var i = 0; i < this.textTypes.length; i++) {
            if (contentType.toLowerCase().indexOf(this.textTypes[i]) >= 0) {
                result = true;
                break;
            }
        }
        return result;
    };
    TNSXMLHttpRequest.prototype._setResponseType = function () {
        var header = this.getResponseHeader('Content-Type') ||
            this.getResponseHeader('content-type');
        var contentType = header && header.toLowerCase();
        if (contentType) {
            if (contentType.indexOf('application/json') >= 0 ||
                contentType.indexOf('+json') >= 0) {
                this._responseType = XMLHttpRequestResponseType.json;
            }
            else if (this.isTextContentType(contentType)) {
                if (contentType.indexOf('text/html') ||
                    contentType.indexOf('text/xml')) {
                    this._responseType = XMLHttpRequestResponseType.document;
                }
                this._responseType = XMLHttpRequestResponseType.text;
            }
        }
        else {
            this._responseType = XMLHttpRequestResponseType.text;
        }
    };
    TNSXMLHttpRequest.prototype.getAllResponseHeaders = function () {
        if (this._readyState < 2) {
            return '';
        }
        var result = '';
        if (typeof this._headers === 'object') {
            var keys = Object.keys(this._headers);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                result += key + ': ' + this._headers[key] + '\r\n';
            }
        }
        return result.substr(0, result.length - 2);
    };
    TNSXMLHttpRequest.prototype.getResponseHeader = function (header) {
        if (typeof header === 'string' &&
            this._readyState > 1 &&
            this._headers) {
            header = header.toLowerCase();
            if (typeof this._headers === 'object') {
                var keys = Object.keys(this._headers);
                for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                    var key = keys_2[_i];
                    var item = key.toLowerCase();
                    if (item === header) {
                        return this._headers[key];
                    }
                }
            }
            return null;
        }
        return null;
    };
    TNSXMLHttpRequest.prototype.overrideMimeType = function (mime) { };
    TNSXMLHttpRequest.prototype._addToStringOnResponse = function () {
        var _this = this;
        if (types.isNullOrUndefined(this.response)) {
            return;
        }
        if (types.isObject(this.response)) {
            Object.defineProperty(this._response, 'toString', {
                configurable: true,
                enumerable: false,
                writable: true,
                value: function () { return _this.responseText; },
            });
        }
    };
    TNSXMLHttpRequest.prototype._toJSString = function (data) {
        var encodings = ['UTF-8', 'US-ASCII', 'ISO-8859-1', null];
        var value;
        var count = encodings.length;
        for (var i = 0; i < count; i++) {
            var encodingType = encodings[i];
            if (encodingType === null) {
                value = (new java.lang.String(data)).toString();
                break;
            }
            try {
                var encoding = java.nio.charset.Charset.forName(encodingType);
                value = (new java.lang.String(data, encoding)).toString();
                break;
            }
            catch (e) { }
        }
        return value;
    };
    TNSXMLHttpRequest.prototype.open = function (method, url, async, username, password) {
        if (async === void 0) { async = true; }
        if (username === void 0) { username = null; }
        if (password === void 0) { password = null; }
        this._headers = {};
        this._responseURL = '';
        this._httpContent = null;
        this._request = {
            method: method,
            url: url,
            async: async,
            username: username,
            password: password,
        };
        this._updateReadyStateChange(this.OPENED);
    };
    TNSXMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        if (this._readyState !== this.OPENED) {
            throw new Error("Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.");
        }
        if (typeof this._headers === 'object') {
            this._headers[header] = value;
        }
    };
    TNSXMLHttpRequest.prototype.send = function (body) {
        var _this = this;
        if (body === void 0) { body = null; }
        if (this._readyState !== this.OPENED) {
            throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED");
        }
        if (!this._headers['Accept']) {
            this._headers['Accept'] = '*/*';
        }
        if (typeof this._request.method === 'string' &&
            this._request.method.toLowerCase() === 'get' &&
            typeof this._request.url === 'string' && !this._request.url.startsWith('http')) {
            var path = void 0;
            if (this._request.url.startsWith('file://')) {
                path = this._request.url.replace('file://', '');
            }
            else if (this._request.url.startsWith('~/')) {
                path = fs.path.join(fs.knownFolders.currentApp().path, this._request.url.replace('~/', ''));
            }
            else if (this._request.url.startsWith('/')) {
                path = this._request.url;
            }
            var responseURL_1 = "file://" + path;
            var contentLength_1 = -1;
            var file = fs.File.fromPath(path);
            if (fs.File.exists(path)) {
                contentLength_1 = file.size;
            }
            this._lastProgress = {
                lengthComputable: contentLength_1 > -1,
                loaded: 0,
                total: contentLength_1,
                target: this,
            };
            var startEvent = new http_request_common_1.ProgressEvent('loadstart', this._lastProgress);
            if (this.onloadstart) {
                this.onloadstart(startEvent);
            }
            this.emitEvent('loadstart', startEvent);
            this._updateReadyStateChange(this.LOADING);
            file_1.FileManager.readFile(path, {}, function (error, data) {
                if (error) {
                    var errorEvent = new http_request_common_1.ProgressEvent('error', _this._lastProgress);
                    _this._responseText = error.message;
                    if (_this.onerror) {
                        _this.onerror(errorEvent);
                    }
                    _this.emitEvent('error', errorEvent);
                    var loadendEvent = new http_request_common_1.ProgressEvent('loadend', _this._lastProgress);
                    if (_this.onloadend) {
                        _this.onloadend(loadendEvent);
                    }
                    _this.emitEvent('loadend', loadendEvent);
                    _this._updateReadyStateChange(_this.DONE);
                }
                else {
                    if (!_this.responseType) {
                        _this._setResponseType();
                    }
                    _this._status = 0;
                    _this._httpContent = data;
                    _this._responseURL = responseURL_1;
                    if (_this.responseType === XMLHttpRequestResponseType.json) {
                        try {
                            if (platform_1.isAndroid) {
                                _this._responseText = _this._toJSString(data);
                                _this._response = JSON.parse(_this._responseText);
                            }
                            else {
                                _this._responseText = NSString.alloc().initWithDataEncoding(data, NSUTF8StringEncoding);
                                if (!_this._responseText) {
                                    _this._responseText = NSString.alloc().initWithDataEncoding(data, NSISOLatin1StringEncoding);
                                }
                                _this._response = JSON.parse(_this._responseText);
                            }
                        }
                        catch (e) {
                            console.log('json parse error', e);
                        }
                    }
                    else if (_this.responseType === XMLHttpRequestResponseType.text) {
                        if (platform_1.isIOS) {
                            var code = NSUTF8StringEncoding;
                            var encodedString = NSString.alloc().initWithDataEncoding(data, code);
                            if (!encodedString) {
                                code = NSISOLatin1StringEncoding;
                                encodedString = NSString.alloc().initWithDataEncoding(data, code);
                            }
                            _this._responseText = _this._response = encodedString.toString();
                        }
                        else {
                            var response = _this._toJSString(data);
                            _this._responseText = _this._response = response
                                ? response.toString()
                                : '';
                        }
                    }
                    else if (_this.responseType === XMLHttpRequestResponseType.document) {
                        if (platform_1.isIOS) {
                            var code = NSUTF8StringEncoding;
                            var encodedString = NSString.alloc().initWithDataEncoding(data, code);
                            if (!encodedString) {
                                code = NSISOLatin1StringEncoding;
                                encodedString = NSString.alloc().initWithDataEncoding(data, code);
                            }
                            _this._responseText = _this._response = encodedString.toString();
                        }
                        else {
                            var response = _this._toJSString(data);
                            _this._responseText = _this._response = response
                                ? response
                                : '';
                        }
                    }
                    else if (_this.responseType === XMLHttpRequestResponseType.arraybuffer) {
                        if (platform_1.isIOS) {
                            _this._response = interop.bufferFromData(data);
                        }
                        else {
                            _this._response = ArrayBuffer.from(java.nio.ByteBuffer.wrap(data));
                        }
                    }
                    else if (_this.responseType === XMLHttpRequestResponseType.blob) {
                        var buffer = void 0;
                        if (platform_1.isIOS) {
                            buffer = interop.bufferFromData(data);
                        }
                        else {
                            buffer = ArrayBuffer.from(java.nio.ByteBuffer.wrap(data));
                        }
                        _this._response = new Blob([buffer]);
                    }
                    var size = 0;
                    if (platform_1.isIOS) {
                        if (data instanceof NSData) {
                            size = data.length;
                        }
                    }
                    else {
                        size = data ? data.length : 0;
                    }
                    _this._lastProgress = {
                        lengthComputable: contentLength_1 > -1,
                        loaded: size,
                        total: contentLength_1,
                        target: _this,
                    };
                    var progressEvent = new http_request_common_1.ProgressEvent('progress', _this._lastProgress);
                    if (_this.onprogress) {
                        _this.onprogress(progressEvent);
                    }
                    _this.emitEvent('progress', progressEvent);
                    _this._addToStringOnResponse();
                    var loadEvent = new http_request_common_1.ProgressEvent('load', _this._lastProgress);
                    if (_this.onload) {
                        _this.onload(loadEvent);
                    }
                    _this.emitEvent('load', loadEvent);
                    var loadendEvent = new http_request_common_1.ProgressEvent('loadend', _this._lastProgress);
                    if (_this.onloadend) {
                        _this.onloadend(loadendEvent);
                    }
                    _this.emitEvent('loadend', loadendEvent);
                    _this._updateReadyStateChange(_this.DONE);
                }
            });
            return;
        }
        var method = this._request.method.toLowerCase();
        var request = {
            content: body,
            method: this._request.method,
            url: this._request.url,
            headers: this._headers,
            onLoading: function () {
                if (_this.onloadstart) {
                    _this.onloadstart();
                }
                var contentLength = -1;
                if (typeof _this._headers === 'object') {
                    if (_this._headers['Content-Length']) {
                        contentLength =
                            parseInt(_this._headers['Content-Length'], 10) || -1;
                    }
                    if (_this._headers['content-length']) {
                        contentLength =
                            parseInt(_this._headers['content-length'], 10) || -1;
                    }
                }
                _this._lastProgress = {
                    lengthComputable: contentLength > -1,
                    loaded: 0,
                    total: contentLength,
                    target: _this,
                };
                var loadStartEvent = new http_request_common_1.ProgressEvent('loadstart', _this._lastProgress);
                if (_this._upload && (method === 'post' || method === 'put')) {
                    _this._upload._emitEvent('loadstart', loadStartEvent);
                }
                _this.emitEvent('loadstart', loadStartEvent);
                _this._updateReadyStateChange(_this.LOADING);
            },
            onHeaders: function (event) {
                if (!isNaN(event.status)) {
                    _this._status = event.status;
                }
                if (event.headers) {
                    _this._headers = event.headers;
                }
                _this._updateReadyStateChange(_this.HEADERS_RECEIVED);
            },
        };
        if (method === 'post' || method === 'put') {
            request.onProgress = function (event) {
                _this._lastProgress = __assign({}, (_this._lastProgress || {}), event);
                if (event.loaded > 0) {
                    var progressEvent = new http_request_common_1.ProgressEvent('progress', _this._lastProgress);
                    if (_this._upload && (method === 'post' || method === 'put')) {
                        _this._upload._emitEvent('progress', progressEvent);
                    }
                    _this.emitEvent('progress', progressEvent);
                }
            };
        }
        if (this.timeout > 0) {
            request['timeout'] = this.timeout;
        }
        this._currentRequest = this._http.request(request);
        this._currentRequest
            .then(function (res) {
            _this._setResponseType();
            _this._status = res.statusCode;
            _this._httpContent = res.content;
            _this._responseURL = res.url;
            if (_this.responseType === XMLHttpRequestResponseType.json) {
                if (typeof res.content === 'string') {
                    _this._responseText = res.content;
                    try {
                        _this._response = JSON.parse(_this.responseText);
                    }
                    catch (err) {
                    }
                }
                else if (typeof res.content === 'object') {
                    _this._response = res.content;
                    _this._responseText = res.responseText;
                }
                else {
                    if (platform_1.isIOS) {
                        if (res.content instanceof NSData) {
                            var code = NSUTF8StringEncoding;
                            var encodedString = NSString.alloc().initWithDataEncoding(res.content, code);
                            if (!encodedString) {
                                code = NSISOLatin1StringEncoding;
                                encodedString = NSString.alloc().initWithDataEncoding(res.content, code);
                            }
                            _this._responseText = encodedString.toString();
                            _this._response = JSON.parse(_this._responseText);
                        }
                    }
                    else {
                        if (res.content instanceof java.nio.ByteBuffer) {
                            _this._responseText = _this._toJSString(res.content.array());
                            _this._response = JSON.parse(_this._responseText);
                        }
                    }
                }
            }
            else if (_this.responseType === XMLHttpRequestResponseType.text) {
                if (typeof res.content === 'string') {
                    _this._responseText = res.content;
                }
                else if (typeof res.content === 'object') {
                    _this._responseText = JSON.stringify(res.content);
                }
                else {
                    if (platform_1.isIOS) {
                        if (res.content instanceof NSData) {
                            var code = NSUTF8StringEncoding;
                            var encodedString = NSString.alloc().initWithDataEncoding(res.content, code);
                            if (!encodedString) {
                                code = NSISOLatin1StringEncoding;
                                encodedString = NSString.alloc().initWithDataEncoding(res.content, code);
                            }
                            _this._responseText = _this._response = encodedString.toString();
                        }
                    }
                    else {
                        if (res.content instanceof java.nio.ByteBuffer) {
                            _this._responseText = _this._response = _this._toJSString(res.content.array());
                        }
                    }
                }
                _this._response = _this._responseText;
            }
            else if (_this.responseType === XMLHttpRequestResponseType.document) {
                if (typeof res.content === 'string') {
                    _this._responseText = res.content;
                }
                else {
                    if (platform_1.isIOS) {
                        if (res.content instanceof NSData) {
                            var code = NSUTF8StringEncoding;
                            var encodedString = NSString.alloc().initWithDataEncoding(res.content, code);
                            if (!encodedString) {
                                code = NSISOLatin1StringEncoding;
                                encodedString = NSString.alloc().initWithDataEncoding(res.content, code);
                            }
                            _this._responseText = _this._response = encodedString.toString();
                        }
                    }
                    else {
                        if (res.content instanceof java.nio.ByteBuffer) {
                            _this._responseText = _this._response = _this._toJSString(res.content.array());
                        }
                    }
                }
            }
            else if (_this.responseType === XMLHttpRequestResponseType.arraybuffer) {
                if (platform_1.isIOS) {
                    _this._response = interop.bufferFromData(res.content);
                }
                else {
                    _this._response = ArrayBuffer.from(res.content);
                }
            }
            else if (_this.responseType === XMLHttpRequestResponseType.blob) {
                var buffer = ArrayBuffer.from(res.content);
                _this._response = new Blob([buffer]);
            }
            _this._addToStringOnResponse();
            if (_this.onload) {
                _this.onload();
            }
            var loadEvent = new http_request_common_1.ProgressEvent('load', _this._lastProgress);
            if (_this._upload && (method === 'post' || method === 'put')) {
                _this._upload._emitEvent('load', loadEvent);
            }
            _this.emitEvent('load', loadEvent);
            if (_this.onloadend) {
                _this.onloadend();
            }
            var loadendEvent = new http_request_common_1.ProgressEvent('loadend', _this._lastProgress);
            if (_this._upload && (method === 'post' || method === 'put')) {
                _this._upload._emitEvent('loadend', loadendEvent);
            }
            _this.emitEvent('loadend', loadendEvent);
            _this._updateReadyStateChange(_this.DONE);
        })
            .catch(function (error) {
            var type = error.type;
            var method = _this._request.method.toLowerCase();
            switch (type) {
                case http_request_common_1.HttpError.Cancelled:
                    if (_this.onabort) {
                        _this.onabort();
                    }
                    var abortEvent = new http_request_common_1.ProgressEvent('abort', _this._lastProgress);
                    if (_this._upload &&
                        (method === 'post' || method === 'put')) {
                        _this._upload._emitEvent('abort', abortEvent);
                    }
                    _this.emitEvent('abort', abortEvent);
                    if (_this.onloadend) {
                        _this.onloadend();
                    }
                    var _loadendEvent = new http_request_common_1.ProgressEvent('loadend', _this._lastProgress);
                    if (_this._upload &&
                        (method === 'post' || method === 'put')) {
                        _this._upload._emitEvent('loadend', _loadendEvent);
                    }
                    _this.emitEvent('loadend', _loadendEvent);
                    if (_this._readyState === _this.UNSENT ||
                        _this._readyState === _this.OPENED ||
                        _this._readyState === _this.DONE) {
                        _this._updateReadyStateChange(_this.UNSENT);
                    }
                    else {
                        _this._updateReadyStateChange(_this.DONE);
                    }
                    _this._currentRequest = null;
                    break;
                case http_request_common_1.HttpError.Timeout:
                    if (_this.ontimeout) {
                        _this.ontimeout();
                    }
                    var timeoutEvent = new http_request_common_1.ProgressEvent('timeout', _this._lastProgress);
                    if (_this._upload &&
                        (method === 'post' || method === 'put')) {
                        _this._upload._emitEvent('timeout', timeoutEvent);
                    }
                    _this.emitEvent('timeout', timeoutEvent);
                    break;
                case http_request_common_1.HttpError.Error:
                    if (_this.onerror) {
                        _this.onerror(error.message);
                    }
                    var errorEvent = new http_request_common_1.ProgressEvent('error', _this._lastProgress);
                    if (_this._upload &&
                        (method === 'post' || method === 'put')) {
                        _this._upload._emitEvent('error', errorEvent);
                    }
                    _this.emitEvent('error', errorEvent);
                    if (_this.onloadend) {
                        _this.onloadend();
                    }
                    var loadendEvent = new http_request_common_1.ProgressEvent('loadend', _this._lastProgress);
                    if (_this._upload &&
                        (method === 'post' || method === 'put')) {
                        _this._upload._emitEvent('loadend', loadendEvent);
                    }
                    _this.emitEvent('loadend', loadendEvent);
                    break;
            }
            _this._updateReadyStateChange(_this.DONE);
        });
    };
    TNSXMLHttpRequest.prototype.abort = function () {
        if (this._currentRequest) {
            this._currentRequest.cancel();
        }
    };
    TNSXMLHttpRequest.prototype.addEventListener = function (eventName, handler) {
        var handlers = this._listeners.get(eventName) || [];
        handlers.push(handler);
        this._listeners.set(eventName, handlers);
    };
    TNSXMLHttpRequest.prototype.removeEventListener = function (eventName, toDetach) {
        var handlers = this._listeners.get(eventName) || [];
        handlers = handlers.filter(function (handler) { return handler !== toDetach; });
        this._listeners.set(eventName, handlers);
    };
    TNSXMLHttpRequest.prototype.emitEvent = function (eventName) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var handlers = this._listeners.get(eventName) || [];
        handlers.forEach(function (handler) {
            handler.apply.apply(handler, [_this].concat(args));
        });
    };
    TNSXMLHttpRequest.prototype.dispatchEvent = function (event) {
        return false;
    };
    TNSXMLHttpRequest.prototype._updateReadyStateChange = function (state) {
        this._readyState = state;
        if (this.onreadystatechange) {
            this.onreadystatechange();
        }
    };
    return TNSXMLHttpRequest;
}());
exports.TNSXMLHttpRequest = TNSXMLHttpRequest;
var FormData = (function () {
    function FormData() {
        this._data = new Map();
    }
    FormData.prototype.append = function (name, value) {
        this._data.set(name, value);
    };
    FormData.prototype.toString = function () {
        var arr = new Array();
        this._data.forEach(function (value, name, map) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
        });
        return arr.join("&");
    };
    return FormData;
}());
exports.FormData = FormData;
var Blob = (function () {
    function Blob(chunks, opts) {
        if (chunks === void 0) { chunks = []; }
        if (opts === void 0) { opts = {}; }
        this[Symbol.toStringTag] = "Blob";
        var dataChunks = [];
        for (var _i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
            var chunk = chunks_1[_i];
            if (chunk instanceof Blob) {
                dataChunks.push(chunk._buffer);
            }
            else if (typeof chunk === "string") {
                var textEncoder = new TextEncoder();
                dataChunks.push(textEncoder.encode(chunk));
            }
            else if (chunk instanceof DataView) {
                dataChunks.push(new Uint8Array(chunk.buffer.slice(0)));
            }
            else if (chunk instanceof ArrayBuffer || ArrayBuffer.isView(chunk)) {
                dataChunks.push(new Uint8Array(ArrayBuffer.isView(chunk)
                    ? chunk.buffer.slice(0)
                    : chunk.slice(0)));
            }
            else {
                var textEncoder = new TextEncoder();
                dataChunks.push(textEncoder.encode(String(chunk)));
            }
        }
        var size = dataChunks.reduce(function (size, chunk) { return size + chunk.byteLength; }, 0);
        var buffer = new Uint8Array(size);
        var offset = 0;
        for (var i = 0; i < dataChunks.length; i++) {
            var chunk = dataChunks[i];
            buffer.set(chunk, offset);
            offset += chunk.byteLength;
        }
        this._buffer = buffer;
        this._size = this._buffer.byteLength;
        this._type = opts.type || "";
        if (/[^\u0020-\u007E]/.test(this._type)) {
            this._type = "";
        }
        else {
            this._type = this._type.toLowerCase();
        }
    }
    Object.defineProperty(Blob.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Blob.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Blob.prototype.arrayBuffer = function () {
        return Promise.resolve(this._buffer);
    };
    Blob.prototype.text = function () {
        var textDecoder = new TextDecoder();
        return Promise.resolve(textDecoder.decode(this._buffer));
    };
    Blob.prototype.slice = function (start, end, type) {
        var slice = this._buffer.slice(start || 0, end || this._buffer.length);
        return new Blob([slice], { type: type });
    };
    Blob.prototype.stream = function () {
        throw new Error("stream is currently not supported");
    };
    Blob.prototype.toString = function () {
        return "[object Blob]";
    };
    Blob.InternalAccessor = (function () {
        function class_1() {
        }
        class_1.getBuffer = function (blob) {
            return blob._buffer;
        };
        return class_1;
    }());
    return Blob;
}());
exports.Blob = Blob;
var File = (function (_super) {
    __extends(File, _super);
    function File(chunks, name, opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this, chunks, opts) || this;
        _this[Symbol.toStringTag] = "File";
        _this._name = name.replace(/\//g, ":");
        _this._lastModified =
            opts.lastModified
                ? new Date(opts.lastModified).valueOf()
                : Date.now();
        return _this;
    }
    Object.defineProperty(File.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(File.prototype, "lastModified", {
        get: function () {
            return this._lastModified;
        },
        enumerable: true,
        configurable: true
    });
    File.prototype.toString = function () {
        return "[object File]";
    };
    return File;
}(Blob));
exports.File = File;
var FileReader = (function () {
    function FileReader() {
        this.EMPTY = 0;
        this.LOADING = 1;
        this.DONE = 2;
        this._listeners = new Map();
        this[Symbol.toStringTag] = "FileReader";
    }
    Object.defineProperty(FileReader.prototype, "readyState", {
        get: function () {
            return this._readyState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileReader.prototype, "result", {
        get: function () {
            return this._result;
        },
        enumerable: true,
        configurable: true
    });
    FileReader.prototype._array2base64 = function (input) {
        var byteToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = [];
        for (var i = 0; i < input.length; i += 3) {
            var byte1 = input[i];
            var haveByte2 = i + 1 < input.length;
            var byte2 = haveByte2 ? input[i + 1] : 0;
            var haveByte3 = i + 2 < input.length;
            var byte3 = haveByte3 ? input[i + 2] : 0;
            var outByte1 = byte1 >> 2;
            var outByte2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
            var outByte3 = ((byte2 & 0x0F) << 2) | (byte3 >> 6);
            var outByte4 = byte3 & 0x3F;
            if (!haveByte3) {
                outByte4 = 64;
                if (!haveByte2) {
                    outByte3 = 64;
                }
            }
            output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
        }
        return output.join("");
    };
    FileReader.prototype._read = function (blob, kind) {
        var _this = this;
        if (!(blob instanceof Blob)) {
            throw new TypeError("Failed to execute '" + kind + "' on 'FileReader': parameter 1 is not of type 'Blob'.");
        }
        this._result = "";
        setTimeout(function () {
            _this._readyState = _this.LOADING;
            _this.emitEvent("load");
            _this.emitEvent("loadend");
        });
    };
    FileReader.prototype.emitEvent = function (eventName) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (types.isFunction(this["on" + eventName])) {
            this["on" + eventName].apply(this, args);
        }
        var handlers = this._listeners.get(eventName) || [];
        handlers.forEach(function (handler) {
            handler.apply(void 0, [_this].concat(args));
        });
    };
    FileReader.prototype.addEventListener = function (eventName, handler) {
        if (["abort", "error", "load", "loadend", "loadstart", "progress"].indexOf(eventName) === -1) {
            throw new Error("Event not supported: " + eventName);
        }
        var handlers = this._listeners.get(eventName) || [];
        handlers.push(handler);
        this._listeners.set(eventName, handlers);
    };
    FileReader.prototype.removeEventListener = function (eventName, toDetach) {
        var handlers = this._listeners.get(eventName) || [];
        handlers = handlers.filter(function (handler) { return handler !== toDetach; });
        this._listeners.set(eventName, handlers);
    };
    FileReader.prototype.readAsDataURL = function (blob) {
        this._read(blob, "readAsDataURL");
        this._result = "data:" + blob.type + ";base64," + this._array2base64(Blob.InternalAccessor.getBuffer(blob));
    };
    FileReader.prototype.readAsText = function (blob) {
        this._read(blob, "readAsText");
        var textDecoder = new TextDecoder();
        this._result = textDecoder.decode(Blob.InternalAccessor.getBuffer(blob));
    };
    FileReader.prototype.readAsArrayBuffer = function (blob) {
        this._read(blob, "readAsArrayBuffer");
        this._result = Blob.InternalAccessor.getBuffer(blob).buffer.slice(0);
    };
    FileReader.prototype.abort = function () {
    };
    FileReader.prototype.toString = function () {
        return "[object FileReader]";
    };
    return FileReader;
}());
exports.FileReader = FileReader;
//# sourceMappingURL=TNSXMLHttpRequest.js.map