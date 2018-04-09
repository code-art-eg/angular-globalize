import { Inject, Injectable, Optional } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ReplaySubject } from "rxjs/ReplaySubject";

export const CANG_SUPPORTED_CULTURES = "CaAngularGlobalizeSupportedCultures";
export const CANG_CULTURE_SERVICE = "CaAngularGlobalizeCultureService";
export const CA_ANGULAR_LOCALE_PROVIDER = "CaAngularGlobalizeLocaleProvider";
export const CANG_LOCALE_STORAGE_KEY = "CaAngularGlobalizeLocaleStorageKey";
export const CANG_COOKIE_NAME = "CaAngularGlobalizeCookieName";
export const CANG_COOKIE_DURATION_DAYS = "CaAngularGlobalizeCookieDurationDays";
export const CANG_COOKIE_PATH = "CaAngularGlobalizeCookiePath";
export const CANG_USE_SESSION_STORAGE = "CaAngularGlobalizeUseSessionStorage";

export const CANG_DEFAULT_LOCALE_KEY = "CaAngularGlobalizeLocaleId";
export const CANG_DEFAULT_COOKIE_NAME = "CaAngularGlobalizeLocaleId";
export const CANG_DEFAULT_COOKIE_DURATION_DAYS = 365;

export interface ICultureService {
    currentCulture: string;
    cultureObservable: Observable<string>;

    isRightToLeft(locale?: string): boolean;
}

export interface ILocaleProvider {
    canWrite: boolean;
    locale: string;
}

@Injectable()
export class CurrentCultureService implements ICultureService {
    private static readonly rtlLangs = ["ar", "dv", "fa", "he",
        "ku", "nqo", "pa", "prs", "ps", "sd", "syr", "tzm", "ug", "ur", "yi"];

    private static areEqual(c1: string, c2: string): boolean {
        if (c2 === null || c2 === undefined || c2 === "") {
            return c1 === null || c1 === undefined || c1 === "";
        }
        if (c1 === null || c1 === undefined || c1 === "") {
            return false;
        }
        c1 = c1.toLowerCase();
        c2 = c2.toLowerCase();
        return c1 === c2;
    }

    private static sameParent(c1: string, c2: string): boolean {
        if (CurrentCultureService.areEqual(c1, c2)) {
            return true;
        }
        if (!c1 || !c2) {
            return false;
        }
        const hyphen1Index = c1.indexOf("-");
        const hyphen2Index = c2.indexOf("-");
        return hyphen1Index > 0 &&
            hyphen2Index > 0 &&
            c1.substr(0, hyphen1Index).toLowerCase() === c2.substr(0, hyphen2Index).toLowerCase();
    }

    private static isParent(c1: string, c2: string): boolean {
        if (CurrentCultureService.areEqual(c1, c2)) {
            return true;
        }
        if (!c1 || !c2) {
            return false;
        }
        const hyphenIndex = c2.indexOf("-");
        if (hyphenIndex >= 0) {
            return CurrentCultureService.areEqual(c1, c2.substr(0, hyphenIndex));
        }
        return false;
    }

    public readonly cultureObservable: Observable<string>;

    private readonly _cultureSubject: ReplaySubject<string>;
    private _culture: string;

    constructor(@Inject(CANG_SUPPORTED_CULTURES) private readonly supportedCultures: string[],
                @Optional() @Inject(CA_ANGULAR_LOCALE_PROVIDER) private readonly localeProviders?: ILocaleProvider[]) {
        if (supportedCultures === null || supportedCultures === undefined) {
            throw new Error("Parameter supportedCultures passed to CurrentCultureService constructor cannot be null.");
        }
        if (supportedCultures.length === 0) {
            throw new Error("Parameter supportedCultures passed to CurrentCultureService constructor cannot be empty.");
        }
        const index = this.findSupportedCultureIndex((v) => v === null || v === undefined || v === "");
        if (index >= 0) {
            throw new Error("Parameter supportedCultures passed to "
                + "CurrentCultureService constructor cannot contain empty values. "
                + `Empty value found at index:${index}.`);
        }
        if (this.localeProviders) {
            for (let i = 0; i < this.localeProviders.length; i++) {
                if (!this.localeProviders[i]) {
                    throw new Error("Parameter localeProviders is invalid. "
                        + `Null or undefined value found at index:${i}.`);
                }
            }
        }
        this._cultureSubject = new ReplaySubject<string>(1);
        this.cultureObservable = this._cultureSubject.asObservable();
        this.currentCulture = null;
    }

    get currentCulture(): string {
        if (this._culture) {
            return this._culture;
        }
        return this.getSupportedCulture(this.getProviderCulture());
    }

    set currentCulture(val: string) {
        if (!val) {
            val = this.getSupportedCulture(this.getProviderCulture());
        } else {
            val = this.getSupportedCulture(val);
        }
        if (val !== this._culture) {
            this._culture = val;
            this._cultureSubject.next(val);
            this.setProviderCulture(val);
        }
    }

    public isRightToLeft(locale?: string): boolean {
        locale = (locale || this.currentCulture).toLowerCase();
        if (!locale) {
            return false;
        }
        let index = locale.indexOf("-");
        if (index < 0) {
            index = locale.indexOf("_");
        }
        if (index > 0) {
            locale = locale.substr(0, index);
        }
        return CurrentCultureService.rtlLangs.indexOf(locale) >= 0;
    }

    private getSupportedCulture(c: string): string {
        let index = this.findSupportedCultureIndex((v) => CurrentCultureService.areEqual(v, c));
        if (index < 0) {
            index = this.findSupportedCultureIndex((v) => CurrentCultureService.isParent(v, c));
        }
        if (index < 0) {
            index = this.findSupportedCultureIndex((v) => CurrentCultureService.isParent(c, v));
        }
        if (index < 0) {
            index = this.findSupportedCultureIndex((v) => CurrentCultureService.sameParent(c, v));
        }
        if (index < 0) {
            index = 0;
        }
        return this.supportedCultures[index];
    }

    private getProviderCulture(): string | null {
        if (!this.localeProviders) {
            return null;
        }
        for (let i = this.localeProviders.length - 1; i >= 0; i--) {
            const val = this.localeProviders[i].locale;
            if (val) {
                return val;
            }
        }
        return null;
    }

    private setProviderCulture(val: string | null): void {
        if (!this.localeProviders) {
            return;
        }
        for (let i = this.localeProviders.length - 1; i >= 0; i--) {
            if (this.localeProviders[i].canWrite) {
                this.localeProviders[i].locale = val;
            }
        }
    }

    private findSupportedCultureIndex(pred: (v: string) => boolean) {
        for (let i = 0; i < this.supportedCultures.length; i++) {
            if (pred(this.supportedCultures[i])) {
                return i;
            }
        }
        return -1;
    }
}
