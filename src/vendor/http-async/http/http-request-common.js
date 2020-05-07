"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveImageStorageKey = 'http.saved-images';
function isImageUrl(url) {
    return url && /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/ig.test(url);
}
exports.isImageUrl = isImageUrl;
function fileNameFromPath(fullPath) {
    var filename = '';
    if (fullPath) {
        filename = fullPath.replace(/^.*[\\\/]/ig, '');
    }
    return filename;
}
exports.fileNameFromPath = fileNameFromPath;
var TNSHttpSettings = (function () {
    function TNSHttpSettings() {
    }
    return TNSHttpSettings;
}());
exports.TNSHttpSettings = TNSHttpSettings;
var ProgressEvent = (function () {
    function ProgressEvent(type, data) {
        if (data === void 0) { data = {
            lengthComputable: false,
            loaded: 0,
            total: 0,
            target: {}
        }; }
        this._type = type;
        this._lengthComputable = data.lengthComputable;
        this._loaded = data.loaded;
        this._total = data.total;
        this._target = data.target;
    }
    Object.defineProperty(ProgressEvent.prototype, "lengthComputable", {
        get: function () {
            return this._lengthComputable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressEvent.prototype, "loaded", {
        get: function () {
            return this._loaded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressEvent.prototype, "total", {
        get: function () {
            return this._total;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressEvent.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProgressEvent.prototype, "target", {
        get: function () {
            return this._target;
        },
        enumerable: true,
        configurable: true
    });
    return ProgressEvent;
}());
exports.ProgressEvent = ProgressEvent;
var HttpError;
(function (HttpError) {
    HttpError[HttpError["Error"] = 0] = "Error";
    HttpError[HttpError["Timeout"] = 1] = "Timeout";
    HttpError[HttpError["Cancelled"] = 2] = "Cancelled";
})(HttpError = exports.HttpError || (exports.HttpError = {}));
var HttpResponseEncoding;
(function (HttpResponseEncoding) {
    HttpResponseEncoding[HttpResponseEncoding["UTF8"] = 0] = "UTF8";
    HttpResponseEncoding[HttpResponseEncoding["GBK"] = 1] = "GBK";
})(HttpResponseEncoding = exports.HttpResponseEncoding || (exports.HttpResponseEncoding = {}));
//# sourceMappingURL=http-request-common.js.map