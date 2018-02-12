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

    getMonthName(month: undefined, locale?: string, type?: 'abbreviated' | 'narrow' | 'wide'): undefined;
    getMonthName(month: null, locale?: string, type?: 'abbreviated' | 'narrow' | 'wide'): null;
    getMonthName(month: number, locale?: string, type?: 'abbreviated' | 'narrow' | 'wide'): string;
    getMonthName(month: undefined, type?: 'abbreviated' | 'narrow' | 'wide'): undefined;
    getMonthName(month: null, type?: 'abbreviated' | 'narrow' | 'wide'): null;
    getMonthName(month: number, type?: 'abbreviated' | 'narrow' | 'wide'): string;

    getDayName(day: undefined, locale?: string, type?: 'abbreviated' | 'short' | 'narrow' | 'wide'): undefined;
    getDayName(day: null, locale?: string, type?: 'abbreviated' | 'short' | 'narrow' | 'wide'): null;
    getDayName(day: number, locale?: string, type?: 'abbreviated' | 'short' | 'narrow' | 'wide'): string;
    getDayName(day: undefined, type?: 'abbreviated' | 'short' | 'narrow' | 'wide'): undefined;
    getDayName(day: null, type?: 'abbreviated' | 'short' | 'narrow' | 'wide'): null;
    getDayName(day: number, type?: 'abbreviated' | 'short' | 'narrow' | 'wide'): string;
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

    getMonthName(month: undefined, locale?: string, type?: 'abbreviated' | 'narrow' | 'wide'): undefined;
    getMonthName(month: null, locale?: string, type?: 'abbreviated' | 'narrow' | 'wide'): null;
    getMonthName(month: number, locale?: string, type?: 'abbreviated' | 'narrow' | 'wide'): string;
    getMonthName(month: undefined, type?: 'abbreviated' | 'narrow' | 'wide'): undefined;
    getMonthName(month: null, type?: 'abbreviated' | 'narrow' | 'wide'): null;
    getMonthName(month: number, type?: 'abbreviated' | 'narrow' | 'wide'): string;
    getMonthName(month: number | undefined | null, locale?: string, type?: 'abbreviated' | 'narrow' | 'wide'): string | null | undefined {
        if (month === null) {
            return null;
        }
        if (month === undefined) {
            return undefined;
        }
        if (!type && (locale === 'abbreviated' || locale === 'narrow' || locale === 'wide')) {
            type = locale;
            locale = null;
        }
        const calendar = this.getCalendar(locale);
        return calendar.getMonthNames(type)[month];
    }

    getDayName(day: undefined, locale?: string, type?: 'abbreviated' | 'short' | 'narrow' | 'wide'): undefined;
    getDayName(day: null, locale?: string, type?: 'abbreviated' | 'short' | 'narrow' | 'wide'): null;
    getDayName(day: number, locale?: string, type?: 'abbreviated' | 'short'| 'narrow' | 'wide'): string;
    getDayName(day: undefined, type?: 'abbreviated' | 'short' | 'narrow' | 'wide'): undefined;
    getDayName(day: null, type?: 'abbreviated' | 'short' | 'narrow' | 'wide'): null;
    getDayName(day: number, type?: 'abbreviated' | 'short'| 'narrow' | 'wide'): string;
    getDayName(day: number | undefined | null, locale?: string, type?: 'abbreviated'| 'short' | 'narrow' | 'wide'): string | null | undefined {
        if (day === null) {
            return null;
        }
        if (day === undefined) {
            return undefined;
        }
        if (!type && (locale === 'abbreviated' || locale === 'short' || locale === 'narrow' || locale === 'wide')) {
            type = locale;
            locale = null;
        }
        const calendar = this.getCalendar(locale);
        return calendar.getDayNames(type)[day];
    }

    getCalendar(locale?: string, calendarName?: string): ICalendarService {
        if (!locale) {
            locale = this.cultureService.currentCulture;
        }
        if (calendarName) {
            if (calendarName.toLowerCase() !== "gregorian")
                throw `Only gregorian calendar is supported`;
        }
        const globalizeInstance = this.getGlobalizeInstance(locale);
        if (globalizeInstance['calendarService']) {
            return globalizeInstance['calendarService'];
        }
        const calendar = new GregorianCalendarService(globalizeInstance.cldr);
        globalizeInstance['calendarService'] = calendar;
        return calendar;
    }
}
