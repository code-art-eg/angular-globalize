import { Pipe, PipeTransform } from '@angular/core';
import { BaseGlobalizePipe } from '../base-globalize-pipe';
import { MonthNameFormat } from '../../models';


@Pipe({ name: 'gmonth', pure: false })
export class GlobalizeMonthPipe extends BaseGlobalizePipe<number, MonthNameFormat> implements PipeTransform {

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
