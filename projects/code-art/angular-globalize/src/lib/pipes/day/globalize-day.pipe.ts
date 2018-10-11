import { Pipe, PipeTransform } from '@angular/core';

import { BaseGlobalizePipe } from '../base-globalize-pipe';
import { DayNameFormat } from '../../models';

@Pipe({ name: 'gday', pure: false })
export class GlobalizeDayPipe extends BaseGlobalizePipe<number, DayNameFormat> implements PipeTransform {

    protected inputsEqual(v1: number, v2: number): boolean {
        return v1 === v2;
    }

    protected optionsEqual(o1: DayNameFormat, o2: DayNameFormat): boolean {
        return o1 === o2;
    }

    protected getDefaultOptions(): DayNameFormat {
        return 'wide';
    }

    protected stringToOptions(optionsString: string): DayNameFormat {
        return optionsString as DayNameFormat;
    }

    protected convertValue(input: number,
                           locale: string,
                           options: DayNameFormat): string {
        return this.globalizeService.getDayName(input, locale, options);
    }
}
