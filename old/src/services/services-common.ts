export { ICalendarService } from "./calendar.service";

export interface DurationFormatOptions {
    style?: "constant" | "short" | "long";
    pattern?: string;
}

export interface ILocaleProvider {
    canWrite: boolean;
    locale: string;
}

export type MonthNameFormat =  "abbreviated" | "narrow" | "wide";
export type DayNameFormat = "abbreviated" | "short" | "narrow" | "wide";

export const CANG_SUPPORTED_CULTURES = "CaAngularGlobalizeSupportedCultures";
export const CA_ANGULAR_LOCALE_PROVIDER = "CaAngularGlobalizeLocaleProvider";

export const CANG_LOCALE_STORAGE_KEY = "CaAngularGlobalizeLocaleStorageKey";
export const CANG_USE_SESSION_STORAGE = "CaAngularGlobalizeUseSessionStorage";

export const CANG_COOKIE_NAME = "CaAngularGlobalizeCookieName";
export const CANG_COOKIE_DURATION_DAYS = "CaAngularGlobalizeCookieDurationDays";
export const CANG_COOKIE_PATH = "CaAngularGlobalizeCookiePath";
export const CANG_DEFAULT_LOCALE_KEY = "CaAngularGlobalizeLocaleId";
export const CANG_DEFAULT_COOKIE_NAME = "CaAngularGlobalizeLocaleId";
export const CANG_DEFAULT_COOKIE_DURATION_DAYS = 365;
