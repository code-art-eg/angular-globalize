import { Pipe, PipeTransform } from '@angular/core';
import { NumberFormatterOptions } from 'globalize';

import { BaseNumericPipe } from '../base-numeric-pipe';

@Pipe({ name: 'gnumber', pure: false })
export class GlobalizeNumberPipe extends BaseNumericPipe<NumberFormatterOptions> implements PipeTransform {

    protected stringToOptions(optionsString: string): NumberFormatterOptions {
        switch (optionsString) {
            case 'decimal':
            case 'percent':
                return {
                    style: optionsString,
                };
            case '%':
                return {
                    style: 'percent',
                };
            default:
                throw new Error(`Invalid number format '${optionsString}'. Valid values are decimal, percent or %`);
        }
    }

    protected getDefaultOptions(): NumberFormatterOptions {
        return { style: 'decimal' };
    }

    protected convertValue(input: number, locale: string, options: NumberFormatterOptions): string {
        return this.globalizeService.formatNumber(input, locale, options);
    }

    protected optionsEqual(o1: NumberFormatterOptions, o2: NumberFormatterOptions): boolean {
        if (!BaseNumericPipe.commonOptionsEqual(o1, o2)) {
            return false;
        }
        if (!o1) {
            return !o2;
        }
        if (!o2) {
            return false;
        }
        return o1.style === o2.style;
    }
}
