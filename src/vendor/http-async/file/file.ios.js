"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var background_queue = dispatch_get_global_queue(21, 0);
var main_queue = dispatch_get_current_queue();
var FileManager = (function () {
    function FileManager() {
    }
    FileManager.writeFile = function (bytes, path, callback) {
        dispatch_async(background_queue, function () {
            try {
                if (bytes instanceof NSData) {
                    bytes.writeToFileAtomically(path, true);
                }
                else if (bytes instanceof ArrayBuffer) {
                    NSData.dataWithData(bytes).writeToFileAtomically(path, true);
                }
                dispatch_async(main_queue, function () {
                    callback(null, path);
                });
            }
            catch (e) {
                dispatch_async(main_queue, function () {
                    callback(e, null);
                });
            }
        });
    };
    FileManager.readFile = function (path, options, callback) {
        if (options === void 0) { options = { asStream: false }; }
        dispatch_async(background_queue, function () {
            try {
                var data_1 = NSData.dataWithContentsOfFile(path);
                dispatch_async(main_queue, function () {
                    callback(null, data_1);
                });
            }
            catch (e) {
                dispatch_async(main_queue, function () {
                    callback(e, null);
                });
            }
        });
    };
    FileManager.deleteFile = function (path, options, callback) {
        if (options === void 0) { options = { asStream: false }; }
        dispatch_async(background_queue, function () {
            try {
                NSFileManager.defaultManager.removeItemAtPathError(path);
                dispatch_async(main_queue, function () {
                    callback(null, true);
                });
            }
            catch (e) {
                dispatch_async(main_queue, function () {
                    callback(e, false);
                });
            }
        });
    };
    return FileManager;
}());
exports.FileManager = FileManager;
//# sourceMappingURL=file.ios.js.map
