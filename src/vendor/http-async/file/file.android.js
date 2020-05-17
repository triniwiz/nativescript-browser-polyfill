"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileManager = (function () {
    function FileManager() {
    }
    FileManager.writeFile = function (bytes, path, callback) {
        var listener = new com.github.triniwiz.async.Async.FileManager.Callback({
            onError: function (param0, param1) {
                callback(param0, null);
            },
            onComplete: function (param0) {
                callback(null, param0);
            }
        });
        if (bytes instanceof java.nio.ByteBuffer) {
            com.github.triniwiz.async.Async.FileManager.writeFile(bytes.array(), path, listener);
        }
        else if (bytes instanceof ArrayBuffer) {
            if (bytes.nativeObject) {
                com.github.triniwiz.async.Async.FileManager.writeFile(bytes.nativeObject.array(), path, listener);
            }
        }
        else {
            com.github.triniwiz.async.Async.FileManager.writeFile(bytes, path, listener);
        }
    };
    FileManager.readFile = function (path, options, callback) {
        if (options === void 0) { options = { asStream: false }; }
        com.github.triniwiz.async.Async.FileManager.readFile(path, null, new com.github.triniwiz.async.Async.FileManager.Callback({
            onError: function (param0, param1) {
                callback(param0, null);
            },
            onComplete: function (param0) {
                callback(null, param0);
            }
        }));
    };
    FileManager.deleteFile = function (path, options, callback) {
        if (options === void 0) { options = { asStream: false }; }
        callback(null, true);
    };
    return FileManager;
}());
exports.FileManager = FileManager;
//# sourceMappingURL=file.android.js.map
