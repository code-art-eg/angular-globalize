import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { InjectionToken, Inject, Injectable, LOCALE_ID, Optional } from '@angular/core';

export const CANG_SUPPORTED_CULTURES = 'CaAngularGlobalizeSupportedCultures';
export const CANG_CULTURE_SERVICE = 'CaAngularGlobalizeCultureService';
export const CA_ANGULAR_LOCALE_PROVIDER = 'CaAngularGlobalizeLocaleProvider';
export const CANG_LOCALE_STORAGE_KEY = 'CaAngularGlobalizeLocaleStorageKey';
export const CANG_COOKIE_NAME = 'CaAngularGlobalizeCookieName';
export const CANG_COOKIE_DURATION_DAYS = 'CaAngularGlobalizeCookieDurationDays';
export const CANG_COOKIE_PATH = 'CaAngularGlobalizeCookiePath';
export const CANG_USE_SESSION_STORAGE = 'CaAngularGlobalizeUseSessionStorage';

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
export class AngularDefaultLocaleProvider implements ILocaleProvider {
    readonly canWrite: boolean = false;
    constructor(@Inject(LOCALE_ID) private readonly localeId: string) {

    }

    get locale(): string {
        return this.localeId;
    }

    set locale(val: string) {
        throw 'Cannot write locale value to AngularDefaultLocaleProvider';
    }
}

@Injectable()
export class NavigatorLanguageLocaleProvider implements ILocaleProvider {
    readonly canWrite: boolean = false;

    get locale(): string {
        if (typeof navigator !== 'undefined') {
            const languages = navigator['languages'];
            if (languages && languages.length > 0 && languages[0])
                return languages[0];
            else if (navigator.language)
                return navigator.language;
            else if (navigator['browserLanguage'])
                return navigator['browserLanguage'];
        }
        return null;
    }

    set locale(val: string) {
        throw 'Cannot write locale value to NavigatorLanguageLocaleProvider';
    }
}

@Injectable()
export class StorageLocaleProvider implements ILocaleProvider {
    readonly canWrite: boolean = true;
    private readonly storage: Storage;

    constructor(
        @Inject(CANG_LOCALE_STORAGE_KEY)  private readonly key?: string,
        @Inject(CANG_USE_SESSION_STORAGE) private readonly useSessionStorage?: boolean
    ) {
        this.key = this.key || CANG_DEFAULT_LOCALE_KEY;
        this.useSessionStorage = this.useSessionStorage || false;
        this.storage = this.useSessionStorage ? sessionStorage : localStorage;
    }

    get locale(): string {
        if (this.storage) {
            return this.storage.getItem(this.key);
        }
        return null;
    }

    set locale(val: string) {
        if (this.storage) {
            if (val) {
                this.storage.setItem(this.key, val);
            } else {
                if (this.storage.getItem(this.key)) {
                    this.storage.removeItem(this.key);
                }
            }
        }
    }
}

@Injectable()
export class CookieLocaleProvider implements ILocaleProvider {
    readonly canWrite: boolean = true;
    private readonly storage: Storage;

    constructor(
        @Inject(CANG_COOKIE_NAME) @Optional() private readonly cookieName?: string,
        @Inject(CANG_COOKIE_DURATION_DAYS) @Optional() private readonly cookieDuration?: number,
        @Inject(CANG_COOKIE_PATH) @Optional() private readonly cookiePath?: string
    ) {
        this.cookieName = this.cookieName || CANG_DEFAULT_COOKIE_NAME;
        this.cookieDuration = this.cookieDuration || CANG_DEFAULT_COOKIE_DURATION_DAYS;
        this.cookiePath = this.cookiePath || '/';
    }

    private static createCookie(name: string, value: string | null, days: number, path: string): void {
        if (!document) {
            return;
        }
        if (!value) {
            days = -365;
        }
        else {
            value = encodeURIComponent(value);
        }
        let expires: string;
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 3600 * 1000));
            expires = `; expires=${date.toUTCString()}`;
        }
        else {
            expires = '';
        }
        name = encodeURIComponent(name);
        document.cookie = `${name}=${value}${expires}; path=${path}`;
    }

    private static getCookie(name: string): string | null {
        if (!document) {
            return null;
        }
        name = encodeURIComponent(name);
        if (document.cookie.length > 0) {
            let start = document.cookie.indexOf(name + "=");
            if (start != -1) {
                start = start + name.length + 1;
                let end = document.cookie.indexOf(";", start);
                if (end == -1) {
                    end = document.cookie.length;
                }
                return decodeURIComponent(document.cookie.substring(start, end));
            }
        }
        return null;
    }

    get locale(): string {
        return CookieLocaleProvider.getCookie(this.cookieName);
    }

    set locale(val: string) {
        CookieLocaleProvider.createCookie(this.cookieName, val, this.cookieDuration, this.cookiePath);
    }
}


@Injectable()
export class CurrentCultureService implements ICultureService {
    constructor( @Inject(CANG_SUPPORTED_CULTURES) private readonly supportedCultures: string[],
        @Optional() @Inject(CA_ANGULAR_LOCALE_PROVIDER) private readonly localeProviders?: ILocaleProvider[]
    ) {
        if (supportedCultures === null || supportedCultures === undefined) {
            throw 'Parameter supportedCultures passed to CurrentCultureService constructor cannot be null.';
        }
        if (supportedCultures.length === 0) {
            throw 'Parameter supportedCultures passed to CurrentCultureService constructor cannot be empty.';
        }
        const index = this.findSupportedCultureIndex(v => v === null || v === undefined || v === '');
        if (index >= 0) {
            throw `Parameter supportedCultures passed to CurrentCultureService constructor cannot contain empty values. Empty value found at index:${index}.`;
        }
        if (this.localeProviders) {
            for (let i = 0; i < this.localeProviders.length; i++) {
                if (!this.localeProviders[i])
                    throw `Parameter localeProviders is invalid. Null or undefined value found at index:${i}.`;
            }
        }
        this.cultureSubject = new ReplaySubject<string>(1);
        this.cultureObservable = this.cultureSubject.asObservable();
        this.currentCulture = null;
    }

    private findSupportedCultureIndex(pred: (v: string) => boolean) {
        for (let i = 0; i < this.supportedCultures.length; i++) {
            if (pred(this.supportedCultures[i])) {
                return i;
            }
        }
        return -1;
    }

    private readonly cultureSubject: ReplaySubject<string>;
    private culture: string;
    readonly cultureObservable: Observable<string>;

    get currentCulture(): string {
        if (this.culture) {
            return this.culture;
        }
        return this.getSupportedCulture(this.getProviderCulture());
    }

    set currentCulture(val: string) {
        if (!val) {
            val = this.getSupportedCulture(this.getProviderCulture());
        }
        else {
            val = this.getSupportedCulture(val);
        }
        if (val !== this.culture) {
            this.culture = val;
            this.cultureSubject.next(val);
            this.setProviderCulture(val);
        }
    }

    private getSupportedCulture(c: string): string {
        let index = this.findSupportedCultureIndex(v => CurrentCultureService.areEqual(v, c));
        if (index < 0) {
            index = this.findSupportedCultureIndex(v => CurrentCultureService.isParent(v, c));
        }
        if (index < 0) {
            index = this.findSupportedCultureIndex(v => CurrentCultureService.isParent(c, v));
        }
        if (index < 0) {
            index = this.findSupportedCultureIndex(v => CurrentCultureService.sameParent(c, v));
        }
        if (index < 0) {
            index = 0;
        }
        return this.supportedCultures[index];
    }

    private static areEqual(c1: string, c2: string): boolean {
        if (c2 === null || c2 === undefined || c2 === '') {
            return c1 === null || c1 === undefined || c1 === '';
        }
        if (c1 === null || c1 === undefined || c1 === '') {
            return false;
        }
        c1 = c1.toLowerCase();
        c2 = c2.toLowerCase();
        if (c1 === c2) {
            return true;
        }
        return false;
    }

    private static sameParent(c1: string, c2: string): boolean {
        if (CurrentCultureService.areEqual(c1, c2)) {
            return true;
        }
        if (!c1 || !c2) {
            return false;
        }
        const hyphen1Index = c1.indexOf('-');
        const hyphen2Index = c2.indexOf('-');
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
        const hyphenIndex = c2.indexOf('-');
        if (hyphenIndex >= 0) {
            return CurrentCultureService.areEqual(c1, c2.substr(0, hyphenIndex));
        }
        return false;
    }

    private getProviderCulture(): string | null {
        if (!this.localeProviders) {
            return null;
        }
        for (let i = this.localeProviders.length - 1; i >= 0; i--) {
            let val = this.localeProviders[i].locale;
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


    private static readonly rtlLangs = ["ar", "dv", "fa", "he", "ku", "nqo", "pa", "prs", "ps", "sd", "syr", "tzm", "ug", "ur", "yi"];

    isRightToLeft(locale?: string): boolean {
        locale = (locale || this.currentCulture).toLowerCase();
        if (!locale) return false;
        for (let i = 0; i < CurrentCultureService.rtlLangs.length; i++) {
            if (locale.indexOf(CurrentCultureService.rtlLangs[i]) === 0) {
                return true;
            }
        }
        return false;
    }
}