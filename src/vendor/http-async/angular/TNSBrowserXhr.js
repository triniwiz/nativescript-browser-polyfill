"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/common/http");
var TNSXMLHttpRequest_1 = require("../xhr/TNSXMLHttpRequest");
var core_1 = require("@angular/core");
var TNSBrowserXhr = (function (_super) {
    __extends(TNSBrowserXhr, _super);
    function TNSBrowserXhr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TNSBrowserXhr.prototype.build = function () {
        return new TNSXMLHttpRequest_1.TNSXMLHttpRequest();
    };
    TNSBrowserXhr = __decorate([
        core_1.Injectable()
    ], TNSBrowserXhr);
    return TNSBrowserXhr;
}(http_1.XhrFactory));
exports.TNSBrowserXhr = TNSBrowserXhr;
//# sourceMappingURL=TNSBrowserXhr.js.map