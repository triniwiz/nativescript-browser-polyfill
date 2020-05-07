import { ModuleWithProviders } from '@angular/core';
import { ISaveImageSettings } from '../http/http-request-common';
export declare class NativeScriptHttpAsyncModule {
    static forRoot(options: {
        configuredProviders?: Array<any>;
        debug?: boolean;
        saveImageSettings?: ISaveImageSettings;
    }): ModuleWithProviders;
    constructor(parentModule: NativeScriptHttpAsyncModule);
}
