import { Injectable } from '@angular/core';
import { DateFormatterOptions } from 'globalize';
import { CldrService } from '../globalization/cldr.service';
import { CurrentCultureService } from '../current-culture/current-culture.service';
import { GlobalizationService } from '../globalization/globalization.service';

@Injectable({
    providedIn: 'root'
})
export class StringFormatterService {

    constructor(
        private readonly globalizationService: GlobalizationService,
        private readonly cldrService: CldrService,
        private readonly currentCultureService: CurrentCultureService,
    ) {
    }

    public formatString(format: string, ...args: any[]): string {
        return this.formatStringWithLocale(format, '', ...args);
    }

    public formatStringWithLocale(format: string, locale: string, ...args: any[]): string {
        locale = locale || this.currentCultureService.currentCulture;
        const rx = /{([^}:]+)(?::([^}]+))?}/g;
        let index = 0;
        let m = rx.exec(format);
        let res = '';
        while (m) {
            if (m.index > index) {
                res += format.substring(index, m.index);
            }
            const arg = this.evaluateArg(m[1], args);
            const formatSpecifier = m[2];
            res += this.formatValue(arg, locale, formatSpecifier);
            index = m.index + m[0].length;
            m = rx.exec(format);
        }
        if (index < format.length) {
            res += format.substring(index);
        }
        return res;
    }

    private evaluateArg(key: string, args: any[]): any {
        if (/^\d+$/.test(key)) {
            const n = parseInt(key, 10);
            return args[n];
        } else {
            const split = key.split('.');
            let arg = args && args[0];
            for (let i = 0; arg !== null && arg !== undefined && i < split.length; i++) {
                arg = arg[split[i]];
            }
            return arg;
        }
    }

    private formatNumber(val: number, locale: string, formatSpecifier: string | null): string {
        if (!formatSpecifier) {
            return this.globalizationService.formatNumber(val, locale);
        }
        const m = /^(?:(?:(?:c|C)([A-Z]{3}))|d|D|f|F|g|G|n|N|p|P|x|X)(\d*)$/.exec(formatSpecifier);
        if (!m) {
            throw new Error(`Invalid format specifier ${formatSpecifier}`);
        }
        const spec = formatSpecifier[0];
        const digits = m[2] ? parseInt(m[2], 10) : undefined;
        if (spec === 'c' || spec === 'C') {
            const currency = m[1];
            return this.globalizationService.formatCurrency(val, currency, locale, {
                maximumFractionDigits: digits,
                minimumFractionDigits: digits,
                style: 'symbol',
            });
        } else if (spec === 'd' || spec === 'D') {
            return this.globalizationService.formatNumber(val, locale, {
                minimumIntegerDigits: digits,
                round: 'truncate',
                style: 'decimal',
            });
        } else if (spec === 'f' || spec === 'F' || spec === 'g' || spec === 'G') {
            return this.globalizationService.formatNumber(val, locale, {
                maximumFractionDigits: digits,
                minimumFractionDigits: digits,
                style: 'decimal',
                useGrouping: false,
            });
        } else if (spec === 'n' || spec === 'N') {
            return this.globalizationService.formatNumber(val, locale, {
                maximumFractionDigits: digits,
                minimumFractionDigits: digits,
                style: 'decimal',
                useGrouping: true,
            });
        } else if (spec === 'p' || spec === 'P') {
            return this.globalizationService.formatNumber(val, locale, {
                maximumFractionDigits: digits,
                minimumFractionDigits: digits,
                style: 'percent',
                useGrouping: true,
            });
        }
        let res = val.toString(16);
        if (spec === 'X') {
            res = res.toUpperCase();
        } else {
            res = res.toLowerCase();
        }
        if (digits) {
            while (res.length < digits) {
                res = '0' + res;
            }
        }
        return res;
    }

    private formatDate(val: Date, locale: string, formatSpecifier: string|null): string {
        const options: DateFormatterOptions = {};
        switch (formatSpecifier) {
            case 'd':
            case null:
                options.date = 'short';
                break;
            case 'D':
                options.date = 'full';
                break;
            case 'f':
            case 'g':
                options.datetime = 'short';
                break;
            case 'F':
            case 'G':
                options.datetime = 'full';
                break;
            case 'm':
            case 'M':
                options.skeleton = 'MMMd';
                break;
            case 't':
                options.time = 'short';
                break;
            case 'T':
                options.time = 'long';
                break;
            case 'y':
                options.time = 'long';
                break;
            case 'Y':
                options.time = 'long';
                break;
        }
        return this.globalizationService.formatDate(val, locale, options);
    }

    private formatValue(val: any, locale: string, formatSpecifier: string | null): string {
        if (val === undefined) {
            return '';
        } else if (val === null) {
            return '';
        } else if (typeof val === 'string') {
            return val;
        } else if (typeof val === 'number') {
            return this.formatNumber(val, locale, formatSpecifier);
        } else if (typeof val === 'boolean') {
            return val ? this.cldrService.getYesMessage(locale) : this.cldrService.getNoMessage(locale);
        } else if (val instanceof Date) {
            return this.formatDate(val, locale, formatSpecifier);
        }
        return val.toString();
    }
}
