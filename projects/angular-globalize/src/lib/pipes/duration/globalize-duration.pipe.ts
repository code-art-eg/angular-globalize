import { Pipe } from '@angular/core';

import { BaseNumericPipe } from '../base-numeric-pipe';
import { DurationFormatOptions } from '../../models';

@Pipe({ name: 'gduration', pure: false })
export class GlobalizeDurationPipe extends BaseNumericPipe<DurationFormatOptions> {

    protected stringToOptions(optionsString: string): DurationFormatOptions {
        switch (optionsString) {
            case 'constant':
            case 'short':
            case 'long':
            case 'racing':
                return {
                    style: optionsString,
                };
            default:
                return {
                    pattern: optionsString,
                };
        }
    }

    protected optionsEqual(o1: DurationFormatOptions, o2: DurationFormatOptions): boolean {
        if (!o1) {
            return !o2;
        }
        if (!o2) {
            return false;
        }
        return o1.pattern === o2.pattern && o1.style === o2.style;
    }

    protected getDefaultOptions(): DurationFormatOptions {
        return { style: 'short' };
    }

    protected convertValue(input: number, locale: string, options: DurationFormatOptions): string {
        return this.globalizeService.formatDuration(input, locale, options);
    }
}
