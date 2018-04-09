import { Inject, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import "reflect-metadata";
import "zone.js";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import {
    CA_ANGULAR_LOCALE_PROVIDER, // This modules export pipes for formatting date, number and currency.
    CANG_GLOBALIZE_STATIC, // This module provides default implementation for services required by GlobalizatioModule
    CANG_SUPPORTED_CULTURES, // This import is needed to load cldr-data while initializing your AppModule
    CookieLocaleProvider, // This import is needed to provide the languages your application support
    GlobalizationModule, GlobalizationServicesModule,
} from "@code-art/angular-globalize";

import { DatePickerModule } from "@code-art/angular-datepicker";

import { AppComponent } from "./app.component";
import { LanguageSwitchComponent } from "./language-switch.component";

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, LanguageSwitchComponent],
    imports: [
        BrowserModule, FormsModule,
        // Specify the library's modules as imports
        GlobalizationModule, GlobalizationServicesModule, DatePickerModule,
        ],
    providers: [
        // Provide a string array of languages your application support
        { provide: CANG_SUPPORTED_CULTURES, useValue: ["en-GB", "de", "ar-EG"] },
        { provide: CA_ANGULAR_LOCALE_PROVIDER, useClass: CookieLocaleProvider, multi: true },
    ],
})
class AppModule {
    constructor( @Inject(CANG_GLOBALIZE_STATIC) globalize: GlobalizeStatic) {

        globalize.load(require("cldr-data/supplemental/metaZones.json"));
        globalize.load(require("cldr-data/supplemental/timeData.json"));
        globalize.load(require("cldr-data/supplemental/weekData.json"));

        globalize.load(require("cldr-data/supplemental/currencyData.json"));
        globalize.load(require("cldr-data/supplemental/plurals.json"));

        globalize.load(require("cldr-data/main/en-GB/numbers.json"));
        globalize.load(require("cldr-data/main/en-GB/ca-gregorian.json"));
        globalize.load(require("cldr-data/main/en-GB/timeZoneNames.json"));
        globalize.load(require("cldr-data/main/en-GB/currencies.json"));

        globalize.load(require("cldr-data/main/de/ca-gregorian.json"));
        globalize.load(require("cldr-data/main/de/timeZoneNames.json"));
        globalize.load(require("cldr-data/main/de/numbers.json"));
        globalize.load(require("cldr-data/main/de/currencies.json"));

        globalize.load(require("cldr-data/main/ar-EG/ca-gregorian.json"));
        globalize.load(require("cldr-data/main/ar-EG/timeZoneNames.json"));
        globalize.load(require("cldr-data/main/ar-EG/numbers.json"));
        globalize.load(require("cldr-data/main/ar-EG/currencies.json"));
    }
}

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        const oldRootElem = document.querySelector("app");
        const newRootElem = document.createElement("app");
        oldRootElem!.parentNode!.insertBefore(newRootElem, oldRootElem);
        modulePromise.then((appModule) => appModule.destroy());
    });
}

const modulePromise = platformBrowserDynamic().bootstrapModule(AppModule);
