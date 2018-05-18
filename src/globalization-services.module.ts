import { NgModule } from "@angular/core";
import { AngularDefaultLocaleProvider } from "./services/angular-default-provider";
import {
    CurrentCultureService,
} from "./services/current-culture.service";

import {
    CA_ANGULAR_LOCALE_PROVIDER, CANG_COOKIE_DURATION_DAYS, CANG_COOKIE_NAME,
    CANG_COOKIE_PATH, CANG_DEFAULT_COOKIE_DURATION_DAYS, CANG_DEFAULT_COOKIE_NAME,
    CANG_DEFAULT_LOCALE_KEY, CANG_LOCALE_STORAGE_KEY, CANG_SUPPORTED_CULTURES, CANG_USE_SESSION_STORAGE,
} from "./services/services-common";

import { GlobalizationService } from "./services/globalize.service";
import { NavigatorLanguageLocaleProvider } from "./services/navigator-language-provider";
import { TypeConverterService } from "./services/type-conversion.service";

@NgModule({
    providers: [
        CurrentCultureService,
        GlobalizationService,
        TypeConverterService,
        { provide: CANG_SUPPORTED_CULTURES, useValue: ["en"] },
        { provide: CANG_COOKIE_DURATION_DAYS, useValue: CANG_DEFAULT_COOKIE_DURATION_DAYS },
        { provide: CANG_COOKIE_NAME, useValue: CANG_DEFAULT_COOKIE_NAME },
        { provide: CANG_COOKIE_PATH, useValue: "/" },
        { provide: CANG_LOCALE_STORAGE_KEY, useValue: CANG_DEFAULT_LOCALE_KEY },
        { provide: CANG_USE_SESSION_STORAGE, useValue: false },

        { provide: CA_ANGULAR_LOCALE_PROVIDER, useClass: NavigatorLanguageLocaleProvider, multi: true },
        { provide: CA_ANGULAR_LOCALE_PROVIDER, useClass: AngularDefaultLocaleProvider, multi: true },
    ],
})
export class GlobalizationServicesModule {

}
