import { Injectable } from '@angular/core';
import { DateFormatterOptions } from 'globalize';

import { BaseGlobalizePipe } from './base-globalize-pipe';

@Injectable()
export abstract class BaseDatePipe extends BaseGlobalizePipe<Date, DateFormatterOptions> {

    protected inputsEqual(v1: Date, v2: Date): boolean {
        return v1.valueOf() === v2.valueOf();
    }

    protected optionsEqual(o1: DateFormatterOptions, o2: DateFormatterOptions): boolean {
        return o1.date === o2.date
            && o1.datetime === o2.datetime
            && o1.raw === o2.raw
            && o1.skeleton === o2.skeleton
            && o1.time === o2.time
            && o1.timeZone === o2.timeZone;
    }
}
