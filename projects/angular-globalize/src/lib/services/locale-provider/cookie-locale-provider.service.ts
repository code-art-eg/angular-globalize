import { Injectable, Optional, Inject } from '@angular/core';

import { ILocaleProvider } from '../../models';
import {
    CANG_COOKIE_NAME, CANG_COOKIE_DURATION_DAYS,
    CANG_COOKIE_PATH, CANG_DEFAULT_COOKIE_NAME,
    CANG_DEFAULT_COOKIE_DURATION_DAYS,
} from '../../constants';

@Injectable()
export class CookieLocaleProviderService implements ILocaleProvider {
    public readonly canWrite: boolean = true;
    private readonly _cookieName: string;
    private readonly _cookieDuration: number;
    private readonly _cookiePath: string;

    private static createCookie(name: string, value: string | null, days: number, path: string): void {
        if (!document) {
            return;
        }
        if (!value) {
            days = -365;
        } else {
            value = encodeURIComponent(value);
        }
        let expires: string;
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 3600 * 1000));
            expires = `; expires=${date.toUTCString()}; samesite=lax`;
        } else {
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
            let start = document.cookie.indexOf(name + '=');
            if (start !== -1) {
                start = start + name.length + 1;
                let end = document.cookie.indexOf(';', start);
                if (end === -1) {
                    end = document.cookie.length;
                }
                return decodeURIComponent(document.cookie.substring(start, end));
            }
        }
        return null;
    }

    constructor(@Inject(CANG_COOKIE_NAME) @Optional() cookieName?: string,
                @Inject(CANG_COOKIE_DURATION_DAYS) @Optional() cookieDuration?: number,
                @Inject(CANG_COOKIE_PATH) @Optional() cookiePath?: string) {
        this._cookieName = cookieName || CANG_DEFAULT_COOKIE_NAME;
        this._cookieDuration = cookieDuration || CANG_DEFAULT_COOKIE_DURATION_DAYS;
        this._cookiePath = cookiePath || '/';
    }

    get locale(): string {
        return CookieLocaleProviderService.getCookie(this._cookieName) || '';
    }

    set locale(val: string) {
        CookieLocaleProviderService.createCookie(this._cookieName, val, this._cookieDuration, this._cookiePath);
    }
}
