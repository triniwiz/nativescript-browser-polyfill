"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_request_common_1 = require("./http-request-common");
var types = require("@nativescript/core/utils/types");
var types_1 = require("@nativescript/core/utils/types");
var debugger_1 = require("@nativescript/core/debugger");
var application_settings_1 = require("@nativescript/core/application-settings");
var file_system_1 = require("@nativescript/core/file-system");
var __1 = require("..");
var HttpResponseEncoding;
(function (HttpResponseEncoding) {
    HttpResponseEncoding[HttpResponseEncoding["UTF8"] = 0] = "UTF8";
    HttpResponseEncoding[HttpResponseEncoding["GBK"] = 1] = "GBK";
})(HttpResponseEncoding = exports.HttpResponseEncoding || (exports.HttpResponseEncoding = {}));
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
function parseJSON(source) {
    var src = source.trim();
    if (src.lastIndexOf(')') === src.length - 1) {
        return JSON.parse(src.substring(src.indexOf('(') + 1, src.lastIndexOf(')')));
    }
    return JSON.parse(src);
}
var textTypes = [
    'text/plain',
    'application/xml',
    'application/rss+xml',
    'text/html',
    'text/xml'
];
var isTextContentType = function (contentType) {
    var result = false;
    for (var i = 0; i < textTypes.length; i++) {
        if (contentType.toLowerCase().indexOf(textTypes[i]) >= 0) {
            result = true;
            break;
        }
    }
    return result;
};
var ɵ0 = isTextContentType;
exports.ɵ0 = ɵ0;
var requestCallbacks = new Map();
var requestIdCounter = 0;
var Http = (function () {
    function Http() {
    }
    Http.buildJavaOptions = function (options) {
        if (!types.isString(options.url)) {
            throw new Error('Http request must provide a valid url.');
        }
        var javaOptions = new com.github.triniwiz.async.Async.Http.RequestOptions();
        javaOptions.url = options.url;
        var method;
        if (types.isString(typeof options.method)) {
            javaOptions.method = options.method;
            method = options.method.toLowerCase();
        }
        if ((method && method === 'post') || method === 'put') {
            if (types.isString(options.content)) {
                javaOptions.content = new java.lang.String(options.content);
            }
            else if (types.isObject(options.content)) {
                javaOptions.content = serialize(options.content);
            }
        }
        if (typeof options.timeout === 'number') {
            javaOptions.timeout = options.timeout;
        }
        if (options.headers) {
            var arrayList_1 = new java.util.ArrayList();
            var pair_1 = com.github.triniwiz.async.Async.Http.KeyValuePair;
            if (options.headers instanceof Map) {
                options.headers.forEach(function (value, key) {
                    arrayList_1.add(new pair_1(key, value + ''));
                });
            }
            else {
                for (var key in options.headers) {
                    arrayList_1.add(new pair_1(key, options.headers[key] + ''));
                }
            }
            javaOptions.headers = arrayList_1;
        }
        return javaOptions;
    };
    Http.buildJavaDownloadOptions = function (options) {
        if (!types.isString(options.url)) {
            throw new Error('Http request must provide a valid url.');
        }
        var javaOptions = new com.github.triniwiz.async.Async.Http.DownloadRequestOptions();
        javaOptions.url = options.url;
        if (typeof options.timeout === 'number') {
            javaOptions.timeout = options.timeout;
        }
        if (typeof options.filePath === 'string') {
            javaOptions.filePath = options.filePath;
        }
        else {
            file_system_1.Folder.fromPath(file_system_1.path.join(file_system_1.knownFolders.temp().path, 'async_http'));
            javaOptions.filePath = file_system_1.path.join(file_system_1.knownFolders.temp().path, 'async_http', java.util.UUID.randomUUID().toString());
        }
        if (options.headers) {
            var arrayList_2 = new java.util.ArrayList();
            var pair_2 = com.github.triniwiz.async.Async.Http.KeyValuePair;
            if (options.headers instanceof Map) {
                options.headers.forEach(function (value, key) {
                    arrayList_2.add(new pair_2(key, value + ''));
                });
            }
            else {
                for (var key in options.headers) {
                    arrayList_2.add(new pair_2(key, options.headers[key] + ''));
                }
            }
            javaOptions.headers = arrayList_2;
        }
        return javaOptions;
    };
    Http.prototype.request = function (options) {
        var headers = {};
        var statusCode = 0;
        var id;
        var counter = requestIdCounter;
        var request = new Promise(function (resolve, reject) {
            try {
                var javaOptions_1 = Http.buildJavaOptions(options);
                if (http_request_common_1.TNSHttpSettings.debug) {
                    if (global.__inspector && global.__inspector.isConnected) {
                        debugger_1.NetworkAgent.requestWillBeSent(requestIdCounter, options);
                    }
                }
                var makeRemoteRequest = function () {
                    var callback = new com.github.triniwiz.async.Async.Http.Callback({
                        onCancel: function (param) {
                            reject({
                                type: http_request_common_1.HttpError.Cancelled,
                                result: param
                            });
                            requestCallbacks.delete(id);
                        },
                        onComplete: function (result) {
                            var content;
                            var responseText;
                            var isString = false;
                            if (result.content instanceof org.json.JSONObject || result.content instanceof org.json.JSONArray) {
                                content = deserialize(result.content);
                                responseText = result.contentText;
                                isString = true;
                            }
                            else {
                                content = result.content;
                                responseText = result.contentText;
                            }
                            if (result && result.headers) {
                                var length_1 = result.headers.size();
                                var pair = void 0;
                                for (var i = 0; i < length_1; i++) {
                                    pair = result.headers.get(i);
                                    addHeader(headers, pair.key, pair.value);
                                }
                            }
                            var contentType = headers['Content-Type'];
                            if (types.isNullOrUndefined(contentType)) {
                                contentType = headers['content-type'];
                            }
                            var acceptHeader;
                            if (types.isNullOrUndefined(contentType)) {
                                acceptHeader = headers['Accept'];
                                if (types.isNullOrUndefined(acceptHeader)) {
                                    acceptHeader = headers['accept'];
                                }
                            }
                            else {
                                acceptHeader = contentType;
                            }
                            var returnType = 'text/plain';
                            if (!types.isNullOrUndefined(acceptHeader) && types.isString(acceptHeader)) {
                                var acceptValues = acceptHeader.split(',');
                                var quality = [];
                                var defaultQuality = [];
                                var customQuality = [];
                                for (var _i = 0, acceptValues_1 = acceptValues; _i < acceptValues_1.length; _i++) {
                                    var value = acceptValues_1[_i];
                                    if (value.indexOf(';q=') > -1) {
                                        customQuality.push(value);
                                    }
                                    else {
                                        defaultQuality.push(value);
                                    }
                                }
                                customQuality = customQuality.sort(function (a, b) {
                                    var a_quality = parseFloat(a.substring(a.indexOf(';q=')).replace(';q=', ''));
                                    var b_quality = parseFloat(b.substring(b.indexOf(';q=')).replace(';q=', ''));
                                    return (b_quality - a_quality);
                                });
                                quality.push.apply(quality, defaultQuality);
                                quality.push.apply(quality, customQuality);
                                returnType = quality[0];
                            }
                            result['statusCode'] = statusCode;
                            if (http_request_common_1.TNSHttpSettings.debug) {
                                if (global.__inspector && global.__inspector.isConnected) {
                                    debugger_1.NetworkAgent.responseReceived(counter, {
                                        url: result.url,
                                        statusCode: statusCode,
                                        headers: headers,
                                        responseAsString: isString ? (result.contentText ? result.contentText : result.content.toString()) : null,
                                        responseAsImage: null
                                    }, headers);
                                }
                            }
                            if (isTextContentType(returnType) && types.isNullOrUndefined(responseText)) {
                                responseText = result.contentText;
                            }
                            if (http_request_common_1.TNSHttpSettings.saveImage && http_request_common_1.TNSHttpSettings.currentlySavedImages && http_request_common_1.TNSHttpSettings.currentlySavedImages[this._url]) {
                                if (http_request_common_1.TNSHttpSettings.currentlySavedImages[this._url].localPath) {
                                    __1.FileManager.writeFile(content, http_request_common_1.TNSHttpSettings.currentlySavedImages[this._url].localPath, function (error, result) {
                                        if (http_request_common_1.TNSHttpSettings.debug) {
                                            console.log('http image save:', error ? error : result);
                                        }
                                    });
                                }
                            }
                            resolve({
                                url: result.url,
                                content: content,
                                responseText: responseText,
                                statusCode: statusCode,
                                headers: headers
                            });
                            requestCallbacks.delete(id);
                        },
                        onError: function (param0, param1) {
                            reject({
                                type: http_request_common_1.HttpError.Error,
                                message: param0
                            });
                            requestCallbacks.delete(id);
                        },
                        onHeaders: function (jHeaders, status) {
                            statusCode = status;
                            var length = jHeaders.size();
                            var pair;
                            for (var i = 0; i < length; i++) {
                                pair = jHeaders.get(i);
                                addHeader(headers, pair.key, pair.value);
                            }
                            if (options.onHeaders) {
                                options.onHeaders(headers, statusCode);
                            }
                            requestCallbacks.delete(id);
                        }, onLoading: function () {
                            options.onLoading();
                            requestCallbacks.delete(id);
                        }, onProgress: function (lengthComputable, loaded, total) {
                            if (options.onProgress) {
                                options.onProgress({
                                    lengthComputable: lengthComputable,
                                    loaded: loaded,
                                    total: total
                                });
                            }
                            requestCallbacks.delete(id);
                        },
                        onTimeout: function () {
                            reject({
                                type: http_request_common_1.HttpError.Timeout
                            });
                            requestCallbacks.delete(id);
                        }
                    });
                    id = com.github.triniwiz.async.Async.Http.makeRequest(javaOptions_1, callback);
                    requestCallbacks.set(id, callback);
                };
                if (http_request_common_1.TNSHttpSettings.saveImage && http_request_common_1.isImageUrl(options.url)) {
                    if (!http_request_common_1.TNSHttpSettings.currentlySavedImages) {
                        var stored = application_settings_1.getString(http_request_common_1.SaveImageStorageKey);
                        if (stored) {
                            try {
                                http_request_common_1.TNSHttpSettings.currentlySavedImages = JSON.parse(stored);
                            }
                            catch (err) {
                                http_request_common_1.TNSHttpSettings.currentlySavedImages = {};
                            }
                        }
                        else {
                            http_request_common_1.TNSHttpSettings.currentlySavedImages = {};
                        }
                    }
                    var imageSetting = http_request_common_1.TNSHttpSettings.currentlySavedImages[options.url];
                    var requests = imageSetting ? imageSetting.requests : 0;
                    var localPath = void 0;
                    if (imageSetting && imageSetting.localPath && file_system_1.File.exists(imageSetting.localPath)) {
                        __1.FileManager.readFile(imageSetting.localPath, null, function (error, file) {
                            if (error) {
                                if (http_request_common_1.TNSHttpSettings.debug) {
                                    console.log('http image load error:', error);
                                }
                            }
                            resolve({
                                url: options.url,
                                responseText: '',
                                statusCode: 200,
                                content: file,
                                headers: {
                                    'Content-Type': 'arraybuffer'
                                }
                            });
                        });
                    }
                    else if (requests >= http_request_common_1.TNSHttpSettings.saveImage.numberOfRequests) {
                        var filename = http_request_common_1.fileNameFromPath(options.url);
                        if (filename.indexOf('?')) {
                            filename = filename.split('?')[0];
                        }
                        localPath = file_system_1.path.join(file_system_1.knownFolders.documents().path, filename);
                        makeRemoteRequest();
                    }
                    http_request_common_1.TNSHttpSettings.currentlySavedImages[options.url] = __assign({}, (imageSetting || {}), { date: Date.now(), requests: requests + 1, localPath: localPath });
                    application_settings_1.setString(http_request_common_1.SaveImageStorageKey, JSON.stringify(http_request_common_1.TNSHttpSettings.currentlySavedImages));
                }
                else {
                    makeRemoteRequest();
                }
                requestIdCounter++;
            }
            catch (ex) {
                reject({
                    type: http_request_common_1.HttpError.Error,
                    message: ex.message
                });
            }
        });
        request['cancel'] = function () {
            com.github.triniwiz.async.Async.Http.cancelRequest(id);
        };
        return request;
    };
    Http.getFile = function (options) {
        var headers = {};
        var statusCode = 0;
        var id;
        var counter = requestIdCounter;
        var request = new Promise(function (resolve, reject) {
            try {
                var javaOptions_2 = Http.buildJavaDownloadOptions(options);
                if (http_request_common_1.TNSHttpSettings.debug) {
                    if (global.__inspector && global.__inspector.isConnected) {
                        debugger_1.NetworkAgent.requestWillBeSent(requestIdCounter, options);
                    }
                }
                var makeRemoteRequest = function () {
                    var callback = new com.github.triniwiz.async.Async.Http.Callback({
                        onCancel: function (param) {
                            reject({
                                type: http_request_common_1.HttpError.Cancelled,
                                result: param
                            });
                            requestCallbacks.delete(id);
                        },
                        onComplete: function (result) {
                            if (result && result.headers) {
                                var length_2 = result.headers.size();
                                var pair = void 0;
                                for (var i = 0; i < length_2; i++) {
                                    pair = result.headers.get(i);
                                    addHeader(headers, pair.key, pair.value);
                                }
                            }
                            var contentType = headers['Content-Type'];
                            if (types.isNullOrUndefined(contentType)) {
                                contentType = headers['content-type'];
                            }
                            var acceptHeader;
                            if (types.isNullOrUndefined(contentType)) {
                                acceptHeader = headers['Accept'];
                                if (types.isNullOrUndefined(acceptHeader)) {
                                    acceptHeader = headers['accept'];
                                }
                            }
                            else {
                                acceptHeader = contentType;
                            }
                            var returnType = 'text/plain';
                            if (!types.isNullOrUndefined(acceptHeader) && types.isString(acceptHeader)) {
                                var acceptValues = acceptHeader.split(',');
                                var quality = [];
                                var defaultQuality = [];
                                var customQuality = [];
                                for (var _i = 0, acceptValues_2 = acceptValues; _i < acceptValues_2.length; _i++) {
                                    var value = acceptValues_2[_i];
                                    if (value.indexOf(';q=') > -1) {
                                        customQuality.push(value);
                                    }
                                    else {
                                        defaultQuality.push(value);
                                    }
                                }
                                customQuality = customQuality.sort(function (a, b) {
                                    var a_quality = parseFloat(a.substring(a.indexOf(';q=')).replace(';q=', ''));
                                    var b_quality = parseFloat(b.substring(b.indexOf(';q=')).replace(';q=', ''));
                                    return (b_quality - a_quality);
                                });
                                quality.push.apply(quality, defaultQuality);
                                quality.push.apply(quality, customQuality);
                                returnType = quality[0];
                            }
                            result['statusCode'] = statusCode;
                            if (http_request_common_1.TNSHttpSettings.debug) {
                                if (global.__inspector && global.__inspector.isConnected) {
                                    debugger_1.NetworkAgent.responseReceived(counter, {
                                        url: result.url,
                                        statusCode: statusCode,
                                        headers: headers,
                                        responseAsString: types_1.isString ? (result.contentText ? result.contentText : result.content.toString()) : null,
                                        responseAsImage: null
                                    }, headers);
                                }
                            }
                            resolve(result.filePath);
                            requestCallbacks.delete(id);
                        },
                        onError: function (param0, param1) {
                            reject({
                                type: http_request_common_1.HttpError.Error,
                                message: param0
                            });
                            requestCallbacks.delete(id);
                        },
                        onHeaders: function (jHeaders, status) {
                            statusCode = status;
                            var length = jHeaders.size();
                            var pair;
                            for (var i = 0; i < length; i++) {
                                pair = jHeaders.get(i);
                                addHeader(headers, pair.key, pair.value);
                            }
                            if (options.onHeaders) {
                                options.onHeaders(headers, statusCode);
                            }
                            requestCallbacks.delete(id);
                        }, onLoading: function () {
                            options.onLoading();
                            requestCallbacks.delete(id);
                        }, onProgress: function (lengthComputable, loaded, total) {
                            if (options.onProgress) {
                                options.onProgress({
                                    lengthComputable: lengthComputable,
                                    loaded: loaded,
                                    total: total
                                });
                            }
                            requestCallbacks.delete(id);
                        },
                        onTimeout: function () {
                            reject({
                                type: http_request_common_1.HttpError.Timeout
                            });
                            requestCallbacks.delete(id);
                        }
                    });
                    id = com.github.triniwiz.async.Async.Http.getFileRequest(javaOptions_2, callback);
                    requestCallbacks.set(id, callback);
                };
                makeRemoteRequest();
                requestIdCounter++;
            }
            catch (ex) {
                reject({
                    type: http_request_common_1.HttpError.Error,
                    message: ex.message
                });
            }
        });
        request['cancel'] = function () {
            com.github.triniwiz.async.Async.Http.cancelRequest(id);
        };
        return request;
    };
    return Http;
}());
exports.Http = Http;
function serialize(data) {
    var store;
    switch (typeof data) {
        case 'string':
        case 'boolean':
        case 'number': {
            return data;
        }
        case 'object': {
            if (!data) {
                return null;
            }
            if (data instanceof Date) {
                return data.toJSON();
            }
            if (Array.isArray(data)) {
                store = new org.json.JSONArray();
                data.forEach(function (item) { return store.put(serialize(item)); });
                return store;
            }
            store = new org.json.JSONObject();
            Object.keys(data).forEach(function (key) { return store.put(key, serialize(data[key])); });
            return store;
        }
        default:
            return null;
    }
}
function deserialize(data) {
    if (types.isNullOrUndefined(data)) {
        return null;
    }
    if (typeof data !== 'object') {
        return data;
    }
    if (typeof data.getClass === 'function') {
        var store = void 0;
        switch (data.getClass().getName()) {
            case 'java.lang.String': {
                return String(data);
            }
            case 'java.lang.Boolean': {
                return String(data) === 'true';
            }
            case 'java.lang.Integer':
            case 'java.lang.Long':
            case 'java.lang.Double':
            case 'java.lang.Short': {
                return Number(data);
            }
            case 'org.json.JSONArray': {
                store = [];
                for (var j = 0; j < data.length(); j++) {
                    store[j] = deserialize(data.get(j));
                }
                break;
            }
            case 'org.json.JSONObject': {
                store = {};
                var i = data.keys();
                while (i.hasNext()) {
                    var key = i.next();
                    store[key] = deserialize(data.get(key));
                }
                break;
            }
            default:
                store = null;
                break;
        }
        return store;
    }
    else {
        return data;
    }
}
function decodeResponse(raw, encoding) {
    var charsetName = 'UTF-8';
    if (encoding === HttpResponseEncoding.GBK) {
        charsetName = 'GBK';
    }
    return new java.lang.String(raw.array(), charsetName);
}
function addHeader(headers, key, value) {
    if (!headers[key]) {
        headers[key] = value;
    }
    else if (Array.isArray(headers[key])) {
        headers[key].push(value);
    }
    else {
        var values = [headers[key]];
        values.push(value);
        headers[key] = values;
    }
}
exports.addHeader = addHeader;
//# sourceMappingURL=http.android.js.map