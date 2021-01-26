import { Pipe } from '@angular/core';
import type { DateFormatterOptions } from 'globalize';

import { BaseDatePipe } from '../base-date-pipe';

@Pipe({ name: 'gdate', pure: false })
// eslint-disable-next-line @angular-eslint/use-pipe-transform-interface
export class GlobalizeDatePipe extends BaseDatePipe {

    protected stringToOptions(optionsString: string): DateFormatterOptions {
        switch (optionsString) {
            case 'short':
            case 'full':
            case 'medium':
            case 'long':
                return {
                    date: optionsString,
                };
            default:
                if (optionsString.indexOf('raw:') === 0) {
                    return {
                        raw: optionsString.substr(4),
                    };
                }
                return {
                    skeleton: optionsString,
                };
        }
    }

    protected getDefaultOptions(): DateFormatterOptions {
        return { date: 'short' };
    }

    protected convertValue(input: Date, locale: string, options: DateFormatterOptions): string {
        return this.globalizeService.formatDate(input, locale, options);
    }
}
