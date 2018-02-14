import { InjectionToken, Injectable, Inject } from '@angular/core';
import { CANG_GLOBALIZATION_SERVICE, IGlobalizationService } from './globalize.service';

export const CANG_TYPE_CONVERTER_SERVICE = new InjectionToken<ITypeConverterService>('CaAngularGlobalizeTypeConverterService');

export interface ITypeConverterService {
    /**
     * Convert a value to string
     * @param val
     */
    convertToString(val: any, locale?: string): string | null;
    /**
     * converts a value to boolean
     * @param val
     */
    convertToBoolean(val: any): boolean;
    /**
     * Converts a value to a number
     * @param val
     */
    convertToNumber(val: any, locale?: string): number | null;
    /**
     * Converts a value to a date
     * @param val
     */
    convertToDate(val: any, locale?: string): Date | null;
}

@Injectable()
export class TypeConverterService implements ITypeConverterService {

    /**
     * constructor. 
     * @param globalizationService - Injected globalization service (optional). When none is provided by angular, default is used.
     */
    constructor( @Inject(CANG_GLOBALIZATION_SERVICE) private readonly globalizationService: IGlobalizationService) {

    }

    private static readonly optionsOrder: DateFormatterOptions[] = [
        { 'date': 'short' },
        { 'datetime': 'short' },
        { 'datetime': 'medium' },
        { 'datetime': 'long' },
        { 'datetime': 'full' },
        { 'date': 'medium' },
        { 'date': 'long' },
        { 'date': 'full' }
    ];

    /**
     * Convert a value to string
     * @param val
     */
    convertToString(val: any, locale?: string): string | null {
        if (val === null || val === undefined) {
            return '';
        }
        if (typeof val === 'string') {
            return val;
        }
        if (typeof val === 'number') {
            return this.globalizationService.formatNumber(val, locale);
        }
        if (typeof val === 'boolean') {
            return val ? 'true' : 'false';
        }
        if (val instanceof Date) {
            return this.globalizationService.formatDate(val, locale, { datetime: 'short' });
        }
        return val.toString();
    }

    /**
     * converts a value to boolean
     * @param val
     */
    convertToBoolean(val: any): boolean {
        if (val === null || val === undefined) {
            return false;
        }
        if (typeof val === 'boolean') {
            return val;
        }
        if (typeof val === 'number') {
            return val !== 0;
        }
        if (typeof val === 'string') {
            return val !== '0' && /^true$/i.test(val);
        }
        throw `Cannot convert value ${val} of type ${typeof val} to Boolean.`;
    }

    /**
     * Converts a value to a number
     * @param val
     */
    convertToNumber(val: any, locale?: string): number | null {
        if (val === null || val === undefined) {
            return null;
        }
        if (typeof val === 'boolean') {
            return val ? 1 : 0;
        }
        if (typeof val === 'number') {
            return val;
        }
        if (typeof val === 'string') {
            return this.globalizationService.parseNumber(val, locale);
        }
        if (val instanceof Date) {
            return val.valueOf();
        }
        throw `Cannot convert value ${val} of type ${typeof val} to Number.`;
    }

    /**
     * Converts a value to a date
     * @param val
     */
    convertToDate(val: any, locale?: string): Date | null {
        if (val === null || val === undefined) {
            return null;
        }
        if (typeof val === 'number') {
            return new Date(val);
        }
        if (typeof val === 'string') {
            if (val === '') {
                return null;
            }
            let d = this.parseDate(val, locale);
            return d;
        }
        if (val instanceof Date) {
            return val;
        }
        throw `Cannot convert value ${val} of type ${typeof val} to Date.`;
    }

    private parseDateWithOptions(val: string, locale: string, options: DateFormatterOptions): Date {
        return this.globalizationService.parseDate(val, locale, options);
    }

    private parseDate(val: string, locale: string): Date {
        for (let i = 0; i < TypeConverterService.optionsOrder.length; i++) {
            const options = TypeConverterService.optionsOrder[i];
            const d = this.parseDateWithOptions(val, locale, options);
            if (d) {
                return d;
            }
        }
        return null;
    }
}
