"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types = require("@nativescript/core/utils/types");
var file_system_1 = require("@nativescript/core/file-system");
var file_1 = require("../file/file");
var http_request_common_1 = require("./http-request-common");
var application_settings_1 = require("@nativescript/core/application-settings");
var HttpResponseEncoding;
(function (HttpResponseEncoding) {
    HttpResponseEncoding[HttpResponseEncoding["UTF8"] = 0] = "UTF8";
    HttpResponseEncoding[HttpResponseEncoding["GBK"] = 1] = "GBK";
})(HttpResponseEncoding = exports.HttpResponseEncoding || (exports.HttpResponseEncoding = {}));
var currentDevice = UIDevice.currentDevice;
var device = currentDevice.userInterfaceIdiom === 0
    ? 'Phone'
    : 'Pad';
var osVersion = currentDevice.systemVersion;
var GET = 'GET';
var USER_AGENT_HEADER = 'User-Agent';
var USER_AGENT = "Mozilla/5.0 (i" + device + "; CPU OS " + osVersion.replace('.', '_') + " like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/" + osVersion + " Mobile/10A5355d Safari/8536.25";
var sessionConfig = NSURLSessionConfiguration.defaultSessionConfiguration;
function parseJSON(source) {
    var src = source.trim();
    if (src.lastIndexOf(')') === src.length - 1) {
        return JSON.parse(src.substring(src.indexOf('(') + 1, src.lastIndexOf(')')));
    }
    return JSON.parse(src);
}
var ɵ0 = function (session, task, response, request, completionHandler) {
    completionHandler(request);
    this._url = response.URL.absoluteString;
}, ɵ1 = function (session, dataTask, data) {
    if (data) {
        if (this._data) {
            this._data.appendData(data);
        }
        var lastProgress = this._lastProgress || {
            lengthComputable: false,
            total: 0
        };
        if (this._data) {
            lastProgress.loaded = this._data.length;
        }
        if (this._onLoading && !this._loadingSent) {
            this._onLoading(lastProgress);
            this._loadingSent = true;
        }
        if (this._onProgress) {
            this._onProgress(lastProgress);
        }
    }
}, ɵ2 = function (session, task, bytesSent, totalBytesSent, totalBytesExpectedToSend) {
    if (this._onLoading || this._onProgress) {
        this._lastProgress = {
            lengthComputable: totalBytesExpectedToSend > -1,
            loaded: totalBytesSent,
            total: totalBytesExpectedToSend > -1 ? totalBytesExpectedToSend : 0
        };
        if (this._onLoading && !this._loadingSent) {
            this._onLoading(this._lastProgress);
            this._loadingSent = true;
        }
        if (this._onProgress) {
            this._onProgress(this._lastProgress);
        }
    }
}, ɵ3 = function (session, dataTask, response, completionHandler) {
    completionHandler(1);
    this._statusCode = response.statusCode;
    this._url = response.URL.absoluteString;
    this._response = response;
    if (this._onHeaders) {
        var headers_1 = {};
        if (response && response.allHeaderFields) {
            var headerFields = response.allHeaderFields;
            headerFields.enumerateKeysAndObjectsUsingBlock(function (key, value, stop) {
                addHeader(headers_1, key, value);
            });
        }
        this._onHeaders({
            headers: headers_1,
            status: this._statusCode
        });
    }
    if (this._onProgress) {
        var lengthComputable = response.expectedContentLength && response.expectedContentLength > -1;
        this._lastProgress = {
            lengthComputable: lengthComputable,
            loaded: 0,
            total: lengthComputable ? response.expectedContentLength : 0
        };
        this._onProgress(this._lastProgress);
    }
}, ɵ4 = function (session, task, error) {
    if (error) {
        if (this._reject) {
            switch (error.code) {
                case NSURLErrorTimedOut:
                    this._reject({
                        type: http_request_common_1.HttpError.Timeout,
                        ios: error,
                        message: error.localizedDescription
                    });
                    break;
                case NSURLErrorCancelled:
                    this._reject({
                        type: http_request_common_1.HttpError.Cancelled,
                        ios: error,
                        message: error.localizedDescription
                    });
                    break;
                default:
                    this._reject({
                        type: http_request_common_1.HttpError.Error,
                        ios: error,
                        message: error.localizedDescription
                    });
                    break;
            }
        }
    }
    else {
        var textTypes_1 = [
            'text/plain',
            'application/xml',
            'application/rss+xml',
            'text/html',
            'text/xml'
        ];
        var isTextContentType = function (contentType) {
            var result = false;
            for (var i = 0; i < textTypes_1.length; i++) {
                if (contentType &&
                    types.isString(contentType) &&
                    contentType.toLowerCase().indexOf(textTypes_1[i]) >= 0) {
                    result = true;
                    break;
                }
            }
            return result;
        };
        var headers_2 = {};
        var response = task ? task.response : null;
        if (response && response.allHeaderFields) {
            var headerFields = response.allHeaderFields;
            headerFields.enumerateKeysAndObjectsUsingBlock(function (key, value, stop) {
                addHeader(headers_2, key, value);
            });
        }
        var request = this._request;
        if (request) {
            var contentType = request.allHTTPHeaderFields.objectForKey('Content-Type');
            if (!contentType) {
                contentType = request.allHTTPHeaderFields.objectForKey('content-type');
            }
            var acceptHeader = void 0;
            if (!contentType) {
                acceptHeader = request.allHTTPHeaderFields.objectForKey('Accept');
            }
            else {
                acceptHeader = contentType;
            }
            var returnType = 'text/plain';
            if (!types.isNullOrUndefined(acceptHeader) &&
                types.isString(acceptHeader)) {
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
                    return b_quality - a_quality;
                });
                quality.push.apply(quality, defaultQuality);
                quality.push.apply(quality, customQuality);
                returnType = quality[0];
            }
            var content = void 0;
            var responseText = void 0;
            if (this._data && isTextContentType(returnType)) {
                responseText = NSDataToString(this._data);
                content = responseText;
            }
            else if (this._data &&
                types.isString(returnType) &&
                returnType.indexOf('application/json') > -1) {
                try {
                    responseText = NSDataToString(this._data);
                    content = JSON.parse(responseText);
                }
                catch (err) {
                    this._reject({
                        type: http_request_common_1.HttpError.Error,
                        ios: null,
                        message: err
                    });
                    return;
                }
            }
            else {
                content = this._data;
            }
            if (http_request_common_1.TNSHttpSettings.saveImage &&
                http_request_common_1.TNSHttpSettings.currentlySavedImages &&
                http_request_common_1.TNSHttpSettings.currentlySavedImages[this._url]) {
                if (http_request_common_1.TNSHttpSettings.currentlySavedImages[this._url].localPath) {
                    file_1.FileManager.writeFile(content, http_request_common_1.TNSHttpSettings.currentlySavedImages[this._url].localPath, function (error, result) {
                        if (http_request_common_1.TNSHttpSettings.debug) {
                            console.log('http image save:', error ? error : result);
                        }
                    });
                }
            }
            if (this._debuggerRequest) {
                this._debuggerRequest.mimeType = this._response.MIMEType;
                this._debuggerRequest.data = this._data;
                var debugResponse = {
                    url: this._url,
                    status: this._statusCode,
                    statusText: NSHTTPURLResponse.localizedStringForStatusCode(this._statusCode),
                    headers: headers_2,
                    mimeType: this._response.MIMEType,
                    fromDiskCache: false
                };
                this._debuggerRequest.responseReceived(debugResponse);
                this._debuggerRequest.loadingFinished();
            }
            this._resolve({
                url: this._url,
                content: content,
                responseText: responseText,
                statusCode: this._statusCode,
                headers: headers_2
            });
        }
    }
};
exports.ɵ0 = ɵ0;
exports.ɵ1 = ɵ1;
exports.ɵ2 = ɵ2;
exports.ɵ3 = ɵ3;
exports.ɵ4 = ɵ4;
var NSURLSessionTaskDelegateImpl = NSObject.extend({
    _lastProgress: {
        lengthComputable: false,
        loaded: 0,
        total: 0
    },
    URLSessionTaskWillPerformHTTPRedirectionNewRequestCompletionHandler: ɵ0,
    URLSessionDataTaskDidReceiveData: ɵ1,
    URLSessionTaskDidSendBodyDataTotalBytesSentTotalBytesExpectedToSend: ɵ2,
    URLSessionDataTaskDidReceiveResponseCompletionHandler: ɵ3,
    URLSessionTaskDidCompleteWithError: ɵ4
}, {
    protocols: [NSURLSessionTaskDelegate, NSURLSessionDataDelegate]
});
NSURLSessionTaskDelegateImpl.initWithDebuggerRequestResolveRejectCallbackHeadersLoadingListener = function (debuggerRequest, request, resolve, reject, onProgress, onHeaders, onLoading) {
    var delegate = NSURLSessionTaskDelegateImpl.new();
    delegate._request = request;
    delegate._resolve = resolve;
    delegate._reject = reject;
    delegate._onProgress = onProgress;
    delegate._onHeaders = onHeaders;
    delegate._onLoading = onLoading;
    delegate._data = NSMutableData.new();
    delegate._debuggerRequest = debuggerRequest;
    return delegate;
};
function NSDataToString(data, encoding) {
    var code = NSUTF8StringEncoding;
    if (encoding === HttpResponseEncoding.GBK) {
        code = 1586;
    }
    var encodedString = NSString.alloc().initWithDataEncoding(data, code);
    if (!encodedString) {
        code = NSISOLatin1StringEncoding;
        encodedString = NSString.alloc().initWithDataEncoding(data, code);
    }
    return encodedString.toString();
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
var Http = (function () {
    function Http() {
    }
    Http.prototype.request = function (options) {
        var _this = this;
        var id = NSUUID.UUID().UUIDString;
        var request = new Promise(function (resolve, reject) {
            if (!options.url) {
                reject(new Error('Request url was empty.'));
                return;
            }
            try {
                var makeRemoteRequest = function () {
                    var urlRequest = NSMutableURLRequest.requestWithURL(NSURL.URLWithString(options.url));
                    urlRequest.HTTPMethod = types.isDefined(options.method)
                        ? options.method
                        : GET;
                    urlRequest.setValueForHTTPHeaderField(USER_AGENT, USER_AGENT_HEADER);
                    if (options.headers) {
                        if (options.headers instanceof Map) {
                            options.headers.forEach(function (value, key) {
                                urlRequest.setValueForHTTPHeaderField(value, key);
                            });
                        }
                        else {
                            for (var header in options.headers) {
                                urlRequest.setValueForHTTPHeaderField(options.headers[header] + '', header);
                            }
                        }
                    }
                    if (types.isString(options.content)) {
                        urlRequest.HTTPBody = NSString.stringWithString(options.content.toString()).dataUsingEncoding(4);
                    }
                    else if (types.isObject(options.content)) {
                        urlRequest.HTTPBody = NSString.stringWithString(JSON.stringify(options.content)).dataUsingEncoding(4);
                    }
                    if (types.isNumber(options.timeout)) {
                        urlRequest.timeoutInterval = options.timeout / 1000;
                    }
                    _this._sessionDelegate = NSURLSessionTaskDelegateImpl.initWithDebuggerRequestResolveRejectCallbackHeadersLoadingListener(debugRequest_1, urlRequest, resolve, reject, options.onProgress, options.onHeaders, options.onLoading);
                    _this._session = NSURLSession.sessionWithConfigurationDelegateDelegateQueue(sessionConfig, _this._sessionDelegate, null);
                    var task = _this._session.dataTaskWithRequest(urlRequest);
                    Http._tasks.set(id, task);
                    if (options.url && debugRequest_1) {
                        var request_1 = {
                            url: options.url,
                            method: 'GET',
                            headers: options.headers
                        };
                        debugRequest_1.requestWillBeSent(request_1);
                    }
                    task.resume();
                };
                var domainDebugger = void 0;
                var debugRequest_1;
                if (http_request_common_1.TNSHttpSettings.debug) {
                    domainDebugger = require('tns-core-modules/debugger');
                    var network = domainDebugger.getNetwork();
                    debugRequest_1 = network && network.create();
                }
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
                    if (imageSetting &&
                        imageSetting.localPath &&
                        file_system_1.File.exists(imageSetting.localPath)) {
                        resolve({
                            url: options.url,
                            responseText: '',
                            statusCode: 200,
                            content: file_system_1.File.fromPath(imageSetting.localPath).readSync(function (err) {
                                if (http_request_common_1.TNSHttpSettings.debug) {
                                    console.log('http image load error:', err);
                                }
                            }),
                            headers: {
                                'Content-Type': 'arraybuffer'
                            }
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
            }
            catch (ex) {
                reject({
                    type: http_request_common_1.HttpError.Error,
                    message: ex
                });
            }
        });
        request['cancel'] = function () {
            var task = Http._tasks.get(id);
            if (task) {
                task.cancel();
            }
        };
        return request;
    };
    Http.getFile = function (options) {
        return null;
    };
    Http._tasks = new Map();
    return Http;
}());
exports.Http = Http;
function deserialize(nativeData) {
    if (types.isNullOrUndefined(nativeData)) {
        return null;
    }
    else {
        switch (types.getClass(nativeData)) {
            case 'NSNull':
                return null;
            case 'NSMutableDictionary':
            case 'NSDictionary':
                var obj = {};
                var length_1 = nativeData.count;
                var keysArray = nativeData.allKeys;
                for (var i = 0; i < length_1; i++) {
                    var nativeKey = keysArray.objectAtIndex(i);
                    obj[nativeKey] = deserialize(nativeData.objectForKey(nativeKey));
                }
                return obj;
            case 'NSMutableArray':
            case 'NSArray':
                var array = [];
                var len = nativeData.count;
                for (var i = 0; i < len; i++) {
                    array[i] = deserialize(nativeData.objectAtIndex(i));
                }
                return array;
            default:
                return nativeData;
        }
    }
}
//# sourceMappingURL=http.ios.js.map