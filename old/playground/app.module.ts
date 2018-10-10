import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import * as Globalize from "globalize";

import {
    CA_ANGULAR_LOCALE_PROVIDER,
    CANG_SUPPORTED_CULTURES,
    CookieLocaleProvider,
    GlobalizationModule,
    GlobalizationServicesModule,
} from "@code-art/angular-globalize";

import { AppComponent } from "./app.component";
import { LanguageSwitchComponent } from "./language-switch.component";

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, LanguageSwitchComponent],
    imports: [
        BrowserModule,
        // Specify the library's modules as imports
        GlobalizationModule, GlobalizationServicesModule,
        ],
    providers: [
        // Provide a string array of languages your application support
        { provide: CANG_SUPPORTED_CULTURES, useValue: ["en-GB", "de", "ar-EG"] },
        { provide: CA_ANGULAR_LOCALE_PROVIDER, useClass: CookieLocaleProvider, multi: true },
    ],
})
export class AppModule {
    constructor() {
        Globalize.loadTimeZone(require("iana-tz-data/iana-tz-data.json"));
        Globalize.load(require("cldr-data/supplemental/metaZones.json"));
        Globalize.load(require("cldr-data/supplemental/timeData.json"));
        Globalize.load(require("cldr-data/supplemental/weekData.json"));

        Globalize.load(require("cldr-data/supplemental/currencyData.json"));
        Globalize.load(require("cldr-data/supplemental/plurals.json"));

        Globalize.load(require("cldr-data/main/en-GB/numbers.json"));
        Globalize.load(require("cldr-data/main/en-GB/ca-gregorian.json"));
        Globalize.load(require("cldr-data/main/en-GB/timeZoneNames.json"));
        Globalize.load(require("cldr-data/main/en-GB/currencies.json"));
        Globalize.load(require("cldr-data/main/en-GB/posix.json"));

        Globalize.load(require("cldr-data/main/de/ca-gregorian.json"));
        Globalize.load(require("cldr-data/main/de/timeZoneNames.json"));
        Globalize.load(require("cldr-data/main/de/numbers.json"));
        Globalize.load(require("cldr-data/main/de/currencies.json"));
        Globalize.load(require("cldr-data/main/de/posix.json"));

        Globalize.load(require("cldr-data/main/ar-EG/ca-gregorian.json"));
        Globalize.load(require("cldr-data/main/ar-EG/timeZoneNames.json"));
        Globalize.load(require("cldr-data/main/ar-EG/numbers.json"));
        Globalize.load(require("cldr-data/main/ar-EG/currencies.json"));
        Globalize.load(require("cldr-data/main/ar-EG/posix.json"));
    }
}
