import { Inject, Injectable, Optional } from "@angular/core";
import {
    CANG_COOKIE_DURATION_DAYS, CANG_COOKIE_NAME, CANG_COOKIE_PATH, CANG_DEFAULT_COOKIE_DURATION_DAYS,
    CANG_DEFAULT_COOKIE_NAME, ILocaleProvider,
} from "./current-culture.service";

@Injectable()
export class CookieLocaleProvider implements ILocaleProvider {
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
            expires = `; expires=${date.toUTCString()}`;
        } else {
            expires = "";
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
            if (start !== -1) {
                start = start + name.length + 1;
                let end = document.cookie.indexOf(";", start);
                if (end === -1) {
                    end = document.cookie.length;
                }
                return decodeURIComponent(document.cookie.substring(start, end));
            }
        }
        return null;
    }

    public readonly canWrite: boolean = true;

    constructor(@Inject(CANG_COOKIE_NAME) @Optional() private readonly cookieName?: string,
                @Inject(CANG_COOKIE_DURATION_DAYS) @Optional() private readonly cookieDuration?: number,
                @Inject(CANG_COOKIE_PATH) @Optional() private readonly cookiePath?: string) {
        this.cookieName = this.cookieName || CANG_DEFAULT_COOKIE_NAME;
        this.cookieDuration = this.cookieDuration || CANG_DEFAULT_COOKIE_DURATION_DAYS;
        this.cookiePath = this.cookiePath || "/";
    }

    get locale(): string {
        return CookieLocaleProvider.getCookie(this.cookieName);
    }

    set locale(val: string) {
        CookieLocaleProvider.createCookie(this.cookieName, val, this.cookieDuration, this.cookiePath);
    }
}
