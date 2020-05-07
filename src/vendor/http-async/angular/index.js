"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var TNSBrowserXhr_1 = require("./TNSBrowserXhr");
var http_1 = require("@angular/common/http");
var http_request_common_1 = require("../http/http-request-common");
var BASE_PROVIDERS = [
    TNSBrowserXhr_1.TNSBrowserXhr,
    { provide: http_1.XhrFactory, useExisting: TNSBrowserXhr_1.TNSBrowserXhr }
];
var NativeScriptHttpAsyncModule = (function () {
    function NativeScriptHttpAsyncModule(parentModule) {
        if (parentModule) {
            throw new Error("NativeScriptHttpAsyncModule has already been loaded. Import NativeScriptHttpAsyncModule in the AppModule only.");
        }
    }
    NativeScriptHttpAsyncModule_1 = NativeScriptHttpAsyncModule;
    NativeScriptHttpAsyncModule.forRoot = function (options) {
        if (options.debug) {
            http_request_common_1.TNSHttpSettings.debug = true;
        }
        if (options.saveImageSettings) {
            http_request_common_1.TNSHttpSettings.saveImage = options.saveImageSettings;
        }
        return {
            ngModule: NativeScriptHttpAsyncModule_1,
            providers: BASE_PROVIDERS.concat((options.configuredProviders || []))
        };
    };
    var NativeScriptHttpAsyncModule_1;
    NativeScriptHttpAsyncModule = NativeScriptHttpAsyncModule_1 = __decorate([
        core_1.NgModule({
            providers: BASE_PROVIDERS
        }),
        __param(0, core_1.Optional()),
        __param(0, core_1.SkipSelf()),
        __metadata("design:paramtypes", [NativeScriptHttpAsyncModule])
    ], NativeScriptHttpAsyncModule);
    return NativeScriptHttpAsyncModule;
}());
exports.NativeScriptHttpAsyncModule = NativeScriptHttpAsyncModule;
//# sourceMappingURL=index.js.map