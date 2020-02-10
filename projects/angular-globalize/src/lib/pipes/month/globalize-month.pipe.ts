import { Pipe } from '@angular/core';
import { BaseGlobalizePipe } from '../base-globalize-pipe';
import { MonthNameFormat } from '../../models';


// tslint:disable-next-line: use-pipe-transform-interface
@Pipe({ name: 'gmonth', pure: false })
export class GlobalizeMonthPipe extends BaseGlobalizePipe<number, MonthNameFormat> {

    protected inputsEqual(v1: number, v2: number): boolean {
        return v1 === v2;
    }

    protected optionsEqual(o1: MonthNameFormat, o2: MonthNameFormat): boolean {
        return o1 === o2;
    }

    protected getDefaultOptions(): MonthNameFormat {
        return 'wide';
    }

    protected stringToOptions(optionsString: string): MonthNameFormat {
        return optionsString as MonthNameFormat;
    }

    protected convertValue(input: number, locale: string, options: MonthNameFormat): string {
        return this.globalizeService.getMonthName(input, locale, options);
    }
}
