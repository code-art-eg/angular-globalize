import { InjectionToken, Inject, Injectable } from '@angular/core';

import { ICultureService, CANG_CULTURE_SERVICE } from './current-culture.service';
import { ICalendarService, GregorianCalendarService } from './calendar.service';

export const CANG_GLOBALIZATION_SERVICE = new InjectionToken<IGlobalizationService>('CaAngularGlobalizeService');
export const CANG_GLOBALIZE_STATIC = new InjectionToken<GlobalizeStatic>('CaAngularGlobalizeStatic');

export const globalizeStatic = ((Globalize: GlobalizeStatic): GlobalizeStatic => {
    Globalize.load(require('cldr-data/supplemental/likelySubtags.json'));
    Globalize.load(require('cldr-data/supplemental/numberingSystems.json'));
    
    return Globalize;

})(require('globalize'));

export { ICalendarService } from './calendar.service';

/**
 * Interface for number and date formatting and parsing.
 * This can be provided via Angular dependency injection.
 * In none is provided, a default one is used.
 */
export interface IGlobalizationService {
    parseDate(val: null, options?: DateFormatterOptions | undefined): null;
    parseDate(val: undefined, options?: DateFormatterOptions | undefined): undefined;
    parseDate(val: string, options?: DateFormatterOptions | undefined): Date;
    parseDate(val: null, locale: string, options?: DateFormatterOptions | undefined): null;
    parseDate(val: undefined, locale: string, options?: DateFormatterOptions | undefined): undefined;
    parseDate(val: string, locale: string, options?: DateFormatterOptions | undefined): Date;

    formatDate(val: null, options?: DateFormatterOptions | undefined): null;
    formatDate(val: undefined, options?: DateFormatterOptions | undefined): undefined;
    formatDate(val: Date, options?: DateFormatterOptions | undefined): string;
    formatDate(val: null, locale: string, options?: DateFormatterOptions | undefined): null;
    formatDate(val: undefined, locale: string, options?: DateFormatterOptions | undefined): undefined;
    formatDate(val: Date, locale: string, options?: DateFormatterOptions | undefined): string;

    parseNumber(val: null, options?: NumberParserOptions | undefined): null;
    parseNumber(val: undefined, options?: NumberParserOptions | undefined): undefined;
    parseNumber(val: string, options?: NumberParserOptions | undefined): number;
    parseNumber(val: null, locale: string, options?: NumberParserOptions | undefined): null;
    parseNumber(val: undefined, locale: string, options?: NumberParserOptions | undefined): undefined;
    parseNumber(val: string, locale: string, options?: NumberParserOptions | undefined): number;

    formatNumber(val: null, options?: NumberFormatterOptions | undefined): null;
    formatNumber(val: undefined, options?: NumberFormatterOptions | undefined): undefined;
    formatNumber(val: number, options?: NumberFormatterOptions | undefined): string;
    formatNumber(val: null, locale: string, options?: NumberFormatterOptions | undefined): null;
    formatNumber(val: undefined, locale: string, options?: NumberFormatterOptions | undefined): undefined;
    formatNumber(val: number, locale: string, options?: NumberFormatterOptions | undefined): string;

    formatCurrency(val: null, currency: string, options?: CurrencyFormatterOptions | undefined): null;
    formatCurrency(val: undefined, currency: string, options?: CurrencyFormatterOptions | undefined): undefined;
    formatCurrency(val: number, currency: string, options?: CurrencyFormatterOptions | undefined): string;
    formatCurrency(val: null, currency: string, locale: string, options?: CurrencyFormatterOptions | undefined): null;
    formatCurrency(val: undefined, currency: string, locale: string, options?: CurrencyFormatterOptions | undefined): undefined;
    formatCurrency(val: number, currency: string, locale: string, options?: CurrencyFormatterOptions | undefined): string;

    getCalendar(locale?: string, calendarName?: string): ICalendarService;
}

/**
 * Default globalization service used when none is provided via dependency injection
 */
@Injectable()
export class DefaultGlobalizationService implements IGlobalizationService {

    private readonly globalizeInstances: { [key: string]: GlobalizeStatic };
    private readonly globalize: GlobalizeStatic;

    // using any for globaize parameter in the constructor because the angular compiler complains about GlobalizeStatic type
    constructor( @Inject(CANG_GLOBALIZE_STATIC) globalize: any,
        @Inject(CANG_CULTURE_SERVICE) private readonly cultureService: ICultureService) {
        this.globalizeInstances = {};
        this.globalize = globalize as GlobalizeStatic;
    }

    private getGlobalizeInstance(locale: string): GlobalizeStatic {
        let instance = this.globalizeInstances[locale];
        if (!instance) {
            instance = new this.globalize(locale);
            this.globalizeInstances[locale] = instance;
        }
        return instance;
    }

    parseDate(val: null, options?: DateFormatterOptions | undefined): null;
    parseDate(val: undefined, options?: DateFormatterOptions | undefined): undefined;
    parseDate(val: string, options?: DateFormatterOptions | undefined): Date;
    parseDate(val: null, locale: string, options?: DateFormatterOptions | undefined): null;
    parseDate(val: undefined, locale: string, options?: DateFormatterOptions | undefined): undefined;
    parseDate(val: string, locale: string, options?: DateFormatterOptions | undefined): Date;
    parseDate(val: string | null | undefined, localeOrOptions?: string | DateFormatterOptions | undefined, options?: DateFormatterOptions | undefined): Date | null | undefined {
        if (val === null) {
            return null;
        }
        if (val === undefined) {
            return undefined;
        }
        let locale: string;
        if (typeof localeOrOptions === 'string') {
            locale = localeOrOptions;
        } else {
            locale = this.cultureService.currentCulture;
            options = localeOrOptions;
        }
        return this.getGlobalizeInstance(locale).parseDate(val, options);
    }

    formatDate(val: null, options?: DateFormatterOptions | undefined): null;
    formatDate(val: undefined, options?: DateFormatterOptions | undefined): undefined;
    formatDate(val: Date, options?: DateFormatterOptions | undefined): string;
    formatDate(val: null, locale: string, options?: DateFormatterOptions | undefined): null;
    formatDate(val: undefined, locale: string, options?: DateFormatterOptions | undefined): undefined;
    formatDate(val: Date, locale: string, options?: DateFormatterOptions | undefined): string;
    formatDate(val: Date | null | undefined, localeOrOptions: string | DateFormatterOptions | undefined, options?: DateFormatterOptions | undefined): string | null | undefined {
        if (val === null) {
            return null;
        }
        if (val === undefined) {
            return undefined;
        }
        let locale: string;
        if (typeof localeOrOptions === 'string') {
            locale = localeOrOptions;
        } else {
            locale = this.cultureService.currentCulture;
            options = localeOrOptions;
        }
        return this.getGlobalizeInstance(locale).formatDate(val, options);
    }

    parseNumber(val: null, options?: NumberParserOptions | undefined): null;
    parseNumber(val: undefined, options?: NumberParserOptions | undefined): undefined;
    parseNumber(val: string, options?: NumberParserOptions | undefined): number;
    parseNumber(val: null, locale: string, options?: NumberParserOptions | undefined): null;
    parseNumber(val: undefined, locale: string, options?: NumberParserOptions | undefined): undefined;
    parseNumber(val: string, locale: string, options?: NumberParserOptions | undefined): number;
    parseNumber(val: string | null | undefined, localeOrOptions: string | NumberParserOptions | undefined, options?: NumberParserOptions | undefined): number | null | undefined {
        if (val === null) {
            return null;
        }
        if (val === undefined) {
            return undefined;
        }
        let locale: string;
        if (typeof localeOrOptions === 'string') {
            locale = localeOrOptions;
        } else {
            locale = this.cultureService.currentCulture;
            options = localeOrOptions;
        }
        return this.getGlobalizeInstance(locale).parseNumber(val, options);
    }

    formatNumber(val: null, options?: NumberFormatterOptions | undefined): null;
    formatNumber(val: undefined, options?: NumberFormatterOptions | undefined): undefined;
    formatNumber(val: number, options?: NumberFormatterOptions | undefined): string;
    formatNumber(val: null, locale: string, options?: NumberFormatterOptions | undefined): null;
    formatNumber(val: undefined, locale: string, options?: NumberFormatterOptions | undefined): undefined;
    formatNumber(val: number, locale: string, options?: NumberFormatterOptions | undefined): string;
    formatNumber(val: number | null | undefined, localeOrOptions: string | NumberFormatterOptions | undefined, options?: NumberFormatterOptions | undefined): string | null | undefined {
        if (val === null) {
            return null;
        }
        if (val === undefined) {
            return undefined;
        }
        let locale: string;
        if (typeof localeOrOptions === 'string') {
            locale = localeOrOptions;
        } else {
            locale = this.cultureService.currentCulture;
            options = localeOrOptions;
        }
        return this.getGlobalizeInstance(locale).formatNumber(val, options);
    }

    formatCurrency(val: null, currency: string, options?: CurrencyFormatterOptions | undefined): null;
    formatCurrency(val: undefined, currency: string, options?: CurrencyFormatterOptions | undefined): undefined;
    formatCurrency(val: number, currency: string, options?: CurrencyFormatterOptions | undefined): string;
    formatCurrency(val: null, currency: string, locale: string, options?: CurrencyFormatterOptions | undefined): null;
    formatCurrency(val: undefined, currency: string, locale: string, options?: CurrencyFormatterOptions | undefined): undefined;
    formatCurrency(val: number, currency: string, locale: string, options?: CurrencyFormatterOptions | undefined): string;
    formatCurrency(val: number | null | undefined, currency: string, localeOrOptions: string | CurrencyFormatterOptions | undefined, options?: CurrencyFormatterOptions | undefined): string | null | undefined {
        if (val === null) {
            return null;
        }
        if (val === undefined) {
            return undefined;
        }
        let locale: string;
        if (typeof localeOrOptions === 'string') {
            locale = localeOrOptions;
        } else {
            locale = this.cultureService.currentCulture;
            options = localeOrOptions;
        }
        return this.getGlobalizeInstance(locale).formatCurrency(val, currency, options);
    }

    getCalendar(locale?: string, calendarName?: string): ICalendarService {
        if (!locale) {
            locale = this.cultureService.currentCulture;
        }
        if (calendarName) {
            if (calendarName.toLowerCase() !== "gregorian")
                throw `Only gregorian calendar is supported`;
        }
        return new GregorianCalendarService(this.getGlobalizeInstance(locale).cldr);
    }
}
