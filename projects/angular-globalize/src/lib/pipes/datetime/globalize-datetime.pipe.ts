import { Pipe, PipeTransform } from '@angular/core';
import { DateFormatterOptions } from 'globalize';

import { BaseDatePipe } from '../base-date-pipe';

@Pipe({ name: 'gdatetime', pure: false })
export class GlobalizeDateTimePipe extends BaseDatePipe implements PipeTransform {

    protected stringToOptions(optionsString: string): DateFormatterOptions {
        switch (optionsString) {
            case 'short':
            case 'full':
            case 'medium':
            case 'long':
                return {
                    datetime: optionsString,
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
        return { datetime: 'short' };
    }

    protected convertValue(input: Date, locale: string, options: DateFormatterOptions): string {
        return this.globalizeService.formatDate(input, locale, options);
    }
}
