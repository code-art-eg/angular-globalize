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

export interface DurationFormatOptions {
    style?: 'constant' | 'short' | 'long';
    pattern?: string;
}

interface NumberFormatInfo {
    zeroChar: string;
    plusSign: string;
    minusSign: string;
    timeSeparator: string;
    decimalSeperator: string;
    groupSeperator: string;
}

/**
 * Interface for number and date formatting and parsing.
 * This can be provided via Angular dependency injection.
 * In none is provided, a default one is used.
 */
export interface IGlobalizationService {
    formatDuration(val: null, options?: DurationFormatOptions | undefined): null;
    formatDuration(val: undefined, options?: DurationFormatOptions | undefined): undefined;
    formatDuration(val: number, options?: DurationFormatOptions | undefined): string;
    formatDuration(val: null, locale: string, options?: DurationFormatOptions | undefined): null;
    formatDuration(val: undefined, locale: string, options?: DurationFormatOptions | undefined): undefined;
    formatDuration(val: number, locale: string, options?: DurationFormatOptions | undefined): string;

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

    private static readonly globalizeInstances: { [key: string]: GlobalizeStatic } = {};
    private static readonly numberParsers: { [key: string]: (n: string) => number } = {};
    private static readonly dateParsers: { [key: string]: (n: string) => Date } = { };
    private static readonly numberFormatters: { [key: string]: (n: number) => string } = { };
    private static readonly currencyFormatters: { [key: string]: (n: number) => string } = { };
    private static readonly dateFormatters: { [key: string]: (n: Date) => string } = {};
    private static readonly numberFormatInfos: { [key: string]: NumberFormatInfo } = {};

    private readonly globalize: GlobalizeStatic;

    // using any for globaize parameter in the constructor because the angular compiler complains about GlobalizeStatic type
    constructor( @Inject(CANG_GLOBALIZE_STATIC) globalize: any,
        @Inject(CANG_CULTURE_SERVICE) private readonly cultureService: ICultureService) {
        this.globalize = globalize as GlobalizeStatic;
    }

    private getGlobalizeInstance(locale: string): GlobalizeStatic {
        let instance = DefaultGlobalizationService.globalizeInstances[locale];
        if (!instance) {
            instance = new this.globalize(locale);
            DefaultGlobalizationService.globalizeInstances[locale] = instance;
        }
        return instance;
    }

    private parseNumberInternal(val: string, locale: string, options: NumberParserOptions): number {
        let key = DefaultGlobalizationService.getNumberParserKey(locale, options);
        let parser = DefaultGlobalizationService.numberParsers[key];
        if (!parser) {
            let instance = this.getGlobalizeInstance(locale);
            parser = instance.numberParser(options);
            DefaultGlobalizationService.numberParsers[key] = parser;
        }
        return parser(val);
    }

    private parseDateInternal(val: string, locale: string, options: DateFormatterOptions): Date {
        let key = DefaultGlobalizationService.getDateFormatterKey(locale, options);
        let parser = DefaultGlobalizationService.dateParsers[key];
        if (!parser) {
            let instance = this.getGlobalizeInstance(locale);
            parser = instance.dateParser(options);
            DefaultGlobalizationService.dateParsers[key] = parser;
        }
        return parser(val);
    }

    private getNumberFormatInfo(locale: string): NumberFormatInfo {
        let info = DefaultGlobalizationService.numberFormatInfos[locale];
        if (!info) {
            const globalizeInstance = this.getGlobalizeInstance(locale);
            const cldr = globalizeInstance.cldr;
            const system = cldr.main(['numbers', 'defaultNumberingSystem']) as string;
            const symbols = cldr.main(['numbers', 'symbols-numberSystem-' + system]) as { [key: string]: string };
            const formatter = this.getNumberFormatter(locale, { style: 'decimal' });
            info = {
                decimalSeperator: symbols['decimal'],
                groupSeperator: symbols['group'],
                minusSign: symbols['minusSign'],
                plusSign: symbols['plusSign'],
                zeroChar: formatter(0),
                timeSeparator: ':'
            };
            DefaultGlobalizationService.numberFormatInfos[locale] = info;
        }
        return info;
    }

    private formatDurationInternal(val: number, locale: string, options: DurationFormatOptions): string {
        options = options || { style: 'short' };
        let pattern = options.pattern;
        if (!pattern) {
            switch (options.style) {
                case 'long':
                    pattern = "[-][d:]hh:mm:ss[.fff]";
                    break;
                case 'short':
                    pattern = "[-][d:]h:mm[:ss[.FFF]]";
                    break;
                case 'constant':
                    pattern = "[-]d:hh:mm:ss.fff";
                    break;
            }
        }

        let formatter = this.getNumberFormatter(locale, { style: 'decimal' } );
        const info = this.getNumberFormatInfo(locale);

        const negative = val < 0;
        val = negative ? -val : val;
        const days = Math.floor(val / 86400000);
        val = val % 86400000;
        const hours = Math.floor(val / 3600000);
        val = val % 3600000;
        const minutes = Math.floor(val / 60000);
        val = val % 60000;
        const seconds = Math.floor(val / 1000);
        const milliseconds = Math.round(val % 1000);

        function countRepeat(s: string, index: number): number {
            let count = 0;
            for (let i = index; i < s.length; i++) {
                if (s[i] !== s[index]) {
                    break;
                }
                count++;
            }
            return count;
        }

        function formatNumber(v: number, minLength: number): string {
            let res = formatter(v);
            while (res.length < minLength) {
                res = info.zeroChar + res;
            }
            return res;
        }

        function findEndQuote(s: string, index: number): number {
            let count = 1;
            for (let i = index + 1; i < s.length; i++) {
                count++;
                if (s[i] === s[index]) {
                    return count;
                }
            }
            throw `Invalid`;
        }

        function findSubPatternEnd(s: string, index: number): number {
            let count = 1;
            let nesting = 1;
            for (let i = index + 1; i < s.length; i++) {
                count++;
                if (s[i] === '[') {
                    nesting++;
                }
                if (s[i] === ']') {
                    nesting--;
                }
                if (nesting < 0)
                    throw `Invalid`;
                if (nesting === 0)
                    return count;
            }
            throw `Invalid`;
        }

        function formatPart(sub: string): [boolean, string] {
            let result = '';
            let hasValue = false;
            let tokenLen: number;
            for (let i = 0; i < sub.length; i += tokenLen) {
                const ch = sub[i];
                tokenLen = 1;
                switch (ch) {
                    case 'd':
                        tokenLen = countRepeat(sub, i);
                        if (tokenLen > 8) {
                            throw `Invalid`;
                        }
                        hasValue = hasValue || days !== 0;
                        result += formatNumber(days, tokenLen);
                        break;
                    case 'h':
                        tokenLen = countRepeat(sub, i);
                        if (tokenLen > 2) {
                            throw `Invalid`;
                        }
                        hasValue = hasValue || hours !== 0;
                        result += formatNumber(hours, tokenLen);
                        break;
                    case 'm':
                        tokenLen = countRepeat(sub, i);
                        if (tokenLen > 2) {
                            throw `Invalid`;
                        }
                        hasValue = hasValue || minutes !== 0;
                        result += formatNumber(minutes, tokenLen);
                        break;
                    case 's':
                        tokenLen = countRepeat(sub, i);
                        if (tokenLen > 2) {
                            throw `Invalid`;
                        }
                        hasValue = hasValue || seconds !== 0;
                        result += formatNumber(seconds, tokenLen);
                        break;
                    case 'f':
                        tokenLen = countRepeat(sub, i);
                        if (tokenLen > 3) {
                            throw `Invalid`;
                        }
                        const msPart = Math.round(milliseconds / 1000 * Math.pow(10, tokenLen));
                        hasValue = hasValue || msPart !== 0;
                        result += formatNumber(msPart, tokenLen);
                        break;
                    case 'F':
                        tokenLen = countRepeat(sub, i);
                        if (tokenLen > 3) {
                            throw `Invalid`;
                        }
                        const msMin = Math.round(milliseconds / 1000 * Math.pow(10, tokenLen));
                        let s = formatNumber(msMin, tokenLen);
                        while (s.length > 0 && s[s.length - 1] === info.zeroChar) {
                            s = s.substr(0, s.length - 1);
                        }
                        hasValue = hasValue || s.length !== 0;
                        result += s;
                        break;
                    case '\'':
                    case '\"':
                        tokenLen = findEndQuote(sub, i);
                        result += sub.substr(i + 1, tokenLen - 2);
                        break;
                    case '\\':
                        if (sub.length < i + 2) {
                            throw `Invalid`;
                        }
                        tokenLen = 2;
                        result += sub[i + 1];
                        break;
                    case '[':
                        tokenLen = findSubPatternEnd(sub, i);
                        let [h, r] = formatPart(sub.substr(i + 1, tokenLen - 2));
                        hasValue = hasValue || h;
                        if (h) {
                            result += r;
                        }
                        break;
                    case '-':
                    case '+':
                        tokenLen = 1;
                        hasValue = hasValue || negative;
                        result += negative ? info.minusSign : info.plusSign;
                        break;
                    case '.':
                        result += info.decimalSeperator;
                        break;
                    case ':':
                        result += info.timeSeparator;
                        break;
                    default:
                        throw `Invalid`;
                }
            }
            return [hasValue, result];
        }
        try {
            let [h, r] = formatPart(pattern);
            return r;
        } catch (e) {
            if (e === 'Invalid') {
                throw `Invalid duration format '${pattern}'`
            }
        }
    }

    private getNumberFormatter(locale: string, options: NumberFormatterOptions): (v: number) => string {
        let key = DefaultGlobalizationService.getNumberFormatterKey(locale, options);
        let formatter = DefaultGlobalizationService.numberFormatters[key];
        if (!formatter) {
            let instance = this.getGlobalizeInstance(locale);
            formatter = instance.numberFormatter(options);
            DefaultGlobalizationService.numberFormatters[key] = formatter;
        }
        return formatter;
    }
    private formatNumberInternal(val: number, locale: string, options: NumberFormatterOptions): string {
        const formatter = this.getNumberFormatter(locale, options);
        return formatter(val);
    }

    private formatDateInternal(val: Date, locale: string, options: DateFormatterOptions): string {
        let key = DefaultGlobalizationService.getDateFormatterKey(locale, options);
        let formatter = DefaultGlobalizationService.dateFormatters[key];
        if (!formatter) {
            let instance = this.getGlobalizeInstance(locale);
            formatter = instance.dateFormatter(options);
            DefaultGlobalizationService.dateFormatters[key] = formatter;
        }
        return formatter(val);
    }

    private formatCurrencyInternal(val: number, currency: string, locale: string, options: CurrencyFormatterOptions): string {
        let key = DefaultGlobalizationService.getCurrencyFormatterKey(locale, currency, options);
        let formatter = DefaultGlobalizationService.currencyFormatters[key];
        if (!formatter) {
            let instance = this.getGlobalizeInstance(locale);
            formatter = instance.currencyFormatter(currency, options);
            DefaultGlobalizationService.currencyFormatters[key] = formatter;
        }
        return formatter(val);
    }

    private static getDateFormatterKey(locale: string, options?: DateFormatterOptions) {
        let key = locale.toLowerCase();
        key = key + '|' + (options && options.date ? options.date.toLowerCase() : '');
        key = key + '|' + (options && options.datetime ? options.datetime.toLowerCase() : '');
        key = key + '|' + (options && options.time ? options.time.toLowerCase() : '');
        key = key + '|' + (options && options.raw ? options.raw.toLowerCase() : '');
        key = key + '|' + (options && options.skeleton ? options.skeleton.toLowerCase() : '');
        key = key + '|' + (options && options.timeZone ? options.timeZone.toLowerCase() : '');
        return key;
    }

    private static getCommonNumberFormatterKey(locale: string, options?: CommonNumberFormatterOptions) {
        let key = locale.toLowerCase();
        key = key + '|' + (options ? options.maximumFractionDigits : '');
        key = key + '|' + (options ? options.maximumSignificantDigits : '');
        key = key + '|' + (options ? options.minimumFractionDigits : '');
        key = key + '|' + (options ? options.minimumIntegerDigits : '');
        key = key + '|' + (options ? options.minimumSignificantDigits : '');
        key = key + '|' + (options && options.round ? options.round.toLocaleLowerCase() : '');
        key = key + '|' + (options && typeof options.useGrouping === 'boolean' ? options.useGrouping : '');
        return key;
    }

    private static getNumberFormatterKey(locale: string, options?: NumberFormatterOptions) {
        let key = DefaultGlobalizationService.getCommonNumberFormatterKey(locale, options);
        key = key + '|' + (options && options.style ? options.style.toLowerCase() : '');
        return key;
    }

    private static getCurrencyFormatterKey(locale: string, currency: string, options?: CurrencyFormatterOptions) {
        let key = DefaultGlobalizationService.getCommonNumberFormatterKey(locale, options);
        key = key + '|' + (options && options.style ? options.style.toLowerCase() : '');
        key = key + '|' + currency;
        return key;
    }

    private static getNumberParserKey(locale: string, options?: NumberParserOptions) {
        let key = locale.toLowerCase();
        key = key + '|' + (options && options.style ? options.style.toLowerCase() : '');
        return key;
    }

    formatDuration(val: null, options?: DurationFormatOptions | undefined): null;
    formatDuration(val: undefined, options?: DurationFormatOptions | undefined): undefined;
    formatDuration(val: number, options?: DurationFormatOptions | undefined): string;
    formatDuration(val: null, locale: string, options?: DurationFormatOptions | undefined): null;
    formatDuration(val: undefined, locale: string, options?: DurationFormatOptions | undefined): undefined;
    formatDuration(val: number, locale: string, options?: DurationFormatOptions | undefined): string;
    formatDuration(val: number | null | undefined, localeOrOptions?: string | DurationFormatOptions | undefined, options?: DurationFormatOptions | undefined): string | null | undefined {
        if (val === null) {
            return null;
        }
        if (val === undefined) {
            return undefined;
        }

        let locale: string;
        if (typeof localeOrOptions === 'string' || options) {
            if (localeOrOptions && typeof (localeOrOptions) !== 'string') {
                throw `Invalid locale ${locale}`;
            }
            locale = (localeOrOptions as string) || this.cultureService.currentCulture;
        } else {
            locale = this.cultureService.currentCulture;
            options = localeOrOptions;
        }
        return this.formatDurationInternal(val, locale, options || undefined);
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
        if (typeof localeOrOptions === 'string' || options) {
            if (localeOrOptions && typeof (localeOrOptions) !== 'string') {
                throw `Invalid locale ${locale}`;
            }
            locale = (localeOrOptions as string) || this.cultureService.currentCulture;
        } else {
            locale = this.cultureService.currentCulture;
            options = localeOrOptions;
        }
        return this.parseDateInternal(val, locale, options || undefined);
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
        if (typeof localeOrOptions === 'string' || options) {
            if (localeOrOptions && typeof (localeOrOptions) !== 'string') {
                throw `Invalid locale ${locale}`;
            }
            locale = (localeOrOptions as string) || this.cultureService.currentCulture;
        } else {
            locale = this.cultureService.currentCulture;
            options = localeOrOptions;
        }
        return this.formatDateInternal(val, locale, options || undefined);
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
        if (typeof localeOrOptions === 'string' || options) {
            if (localeOrOptions && typeof (localeOrOptions) !== 'string') {
                throw `Invalid locale ${locale}`;
            }
            locale = (localeOrOptions as string) || this.cultureService.currentCulture;
        } else {
            locale = this.cultureService.currentCulture;
            options = localeOrOptions;
        }
        return this.parseNumberInternal(val, locale, options || undefined);
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
        if (typeof localeOrOptions === 'string' || options) {
            if (localeOrOptions && typeof (localeOrOptions) !== 'string') {
                throw `Invalid locale ${locale}`;
            }
            locale = (localeOrOptions as string) || this.cultureService.currentCulture;
        } else {
            locale = this.cultureService.currentCulture;
            options = localeOrOptions;
        }
        return this.formatNumberInternal(val, locale, options || undefined);
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
        if (typeof localeOrOptions === 'string' || options) {
            if (localeOrOptions && typeof (localeOrOptions) !== 'string') {
                throw `Invalid locale ${locale}`;
            }
            locale = (localeOrOptions as string) || this.cultureService.currentCulture;
        } else {
            locale = this.cultureService.currentCulture;
            options = localeOrOptions;
        }
        return this.formatCurrencyInternal(val, currency, locale, options || undefined);
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
    getDayName(day: number, locale?: string, type?: 'abbreviated' | 'short' | 'narrow' | 'wide'): string;
    getDayName(day: undefined, type?: 'abbreviated' | 'short' | 'narrow' | 'wide'): undefined;
    getDayName(day: null, type?: 'abbreviated' | 'short' | 'narrow' | 'wide'): null;
    getDayName(day: number, type?: 'abbreviated' | 'short' | 'narrow' | 'wide'): string;
    getDayName(day: number | undefined | null, locale?: string, type?: 'abbreviated' | 'short' | 'narrow' | 'wide'): string | null | undefined {
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
